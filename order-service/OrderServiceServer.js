const con = require('./config/db.js').default;

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};
app.use(cors(corsOptions));


function authMiddleware(req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, 'jktrxsw2005');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// POST /create
app.post('/create', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { addressId, newAddress, paymentMethod } = req.body;

  if (!addressId && !newAddress) {
    return res.status(400).json({ message: 'addressId or newAddress required' });
  }

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // 1) resolve addressId (verify ownership or insert new address)
    let resolvedAddressId = null;

    if (addressId) {
      const [rows] = await conn.query(
        'SELECT idaddresses FROM addresses WHERE idaddresses = ? AND addresses_user_id = ?',
        [addressId, userId]
      );
      if (!rows.length) {
        throw new Error('Address not found or does not belong to user');
      }
      resolvedAddressId = addressId;
    } else {
      // validate newAddress fields
      const { street, city, country } = newAddress || {};
      if (!street || !city || !country) {
        throw new Error('Incomplete newAddress: street, city and country are required');
      }
      const [ins] = await conn.query(
        'INSERT INTO addresses (addresses_user_id, street, city, country) VALUES (?, ?, ?, ?)',
        [userId, street, city, country]
      );
      resolvedAddressId = ins.insertId;
    }

    // 2) fetch cart items for user (inside transaction)
    const [cartRows] = await conn.query(
      'SELECT c.good_id, c.quantity, g.default_price FROM cart c JOIN goods g ON c.good_id = g.idgoods WHERE c.user_id = ?',
      [userId]
    );

    if (!cartRows.length) {
      throw new Error('Cart is empty');
    }

    // 3) insert order
    const [orderRes] = await conn.query(
      'INSERT INTO orders (Iduser, order_date, address_id) VALUES (?, NOW(), ?)',
      [userId, resolvedAddressId]
    );
    const orderId = orderRes.insertId;

    // 4) insert order_items
    const itemsValues = cartRows.map(r => [orderId, r.good_id, r.quantity, r.default_price]);
    await conn.query('INSERT INTO order_items (order_id, id_good, quantity, price) VALUES ?', [itemsValues]);

    // 5) insert outbox event (payload should include necessary data)
    const payload = {
      orderId,
      userId,
      addressId: resolvedAddressId,
      paymentMethod: paymentMethod || null,
      total: cartRows.reduce((s, it) => s + it.quantity * it.default_price, 0),
      items: cartRows.map(it => ({ good_id: it.good_id, quantity: it.quantity, price: it.default_price })),
      createdAt: new Date().toISOString()
    };

    await conn.query(
      'INSERT INTO outbox (aggregate_type, aggregate_id, event_type, payload) VALUES (?, ?, ?, ?)',
      ['order', orderId, 'order.created', JSON.stringify(payload)]
    );

    // 6) clear cart
    await conn.query('DELETE FROM cart WHERE user_id = ?', [userId]);

    // commit
    await conn.commit();

    res.json({ message: 'Order created', orderId });
  } catch (err) {
    // rollback if transaction started
    try { if (conn) await conn.rollback(); } catch (e) { /* ignore */ }
    console.error('Order creation failed:', err);
    // send friendly message
    return res.status(400).json({ message: err.message || 'Failed to create order' });
  } finally {
    if (conn) conn.release();
  }
});

// GET /addresses (unchanged; using pool)
app.get('/addresses', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const [rows] = await pool.query('SELECT idaddresses, street, city, country FROM addresses WHERE addresses_user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'DB error' });
  }
});

app.listen(3004, () => {
  console.log("Order service running on port 3004");
});
