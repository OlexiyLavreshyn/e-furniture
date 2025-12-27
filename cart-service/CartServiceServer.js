const con = require('./config/db.js').default;

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with the actual origin of your React app
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials like cookies (if needed)
};

app.use(cors(corsOptions));



con.connect(function(err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database as id ' + con.threadId);
});

function authMiddleware(req, res, next) {
  const token = req.cookies.auth_token;

  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, 'jktrxsw2005');
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

app.post('/add', authMiddleware, (req, res) => {
  const userId = req.user.userId;
  const { productId, quantity } = req.body;

  con.query(
    `
    INSERT INTO cart (user_id, good_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + ?
    `,
    [userId, productId, quantity, quantity],
    (err) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Added to cart' });
    }
  );
});


app.get('/cart', authMiddleware, (req, res) => {
  const userId = req.user.userId;

  con.query(
    `
    SELECT 
      c.idcart AS cartId,
      c.good_id,
      c.quantity,
      g.name,
      g.default_price,
      g.image
    FROM cart c
    JOIN goods g ON c.good_id = g.idgoods
    WHERE c.user_id = ?
    `,
    [userId],
    (err, result) => {
      if (err) return console.log(err);
      res.json(result);
    }
  );
});


//SUM(c.quantity) AS quantity
app.post('/update', authMiddleware, (req, res) => {
  const userId = req.user.userId;
  const { cartId, quantity } = req.body;
    console.log(cartId);
  con.query(
    `
    UPDATE cart 
    SET quantity = ?
    WHERE idcart = ? AND user_id = ?
    `,
    [quantity, cartId, userId],
    (err) => {
      if (err) return console.log(err);
      res.json({ message: 'Updated' });
    }
  );
});



// Remove item
app.delete('/remove/:cartId', authMiddleware, (req, res) => {
  const userId = req.user.userId;
  const cartId = req.params.cartId;

  con.query(
    `
    DELETE FROM cart 
    WHERE idcart = ? AND user_id = ?
    `,
    [cartId, userId],
    (err) => {
      if (err) return res.status(500).json({ message: 'DB error' });
      res.json({ message: 'Removed' });
    }
  );
});


app.listen(3003, () => {
    console.log("running on port 3003");
})
