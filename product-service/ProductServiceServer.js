const con = require('./config/db.js').default;

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173"
}));



con.connect(function(err) {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the database as id ' + con.threadId);
});






app.get('/products', (req, res) => {
  console.log("products enter");
  const { category } = req.query;
  console.log(category);

  let sql = `
    SELECT 
      g.idgoods,
      g.name,
      g.default_price,
      g.image,
      c.categorie_name AS category
    FROM goods g
    JOIN categories c ON g.categorie = c.idcategories
  `;

  const params = [];

  if (category) {
    sql += ' WHERE c.categorie_name = ?';
    params.push(category);
  }

  con.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});


app.get('/product/:id', (req, res) => {
  const id = req.params.id;

  con.query(
    'SELECT * FROM goods WHERE idgoods = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      if (result.length === 0) return res.status(404).json({ message: 'Not found' });

      res.json(result[0]);
    }
  );
});


app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  con.query("DELETE FROM goods WHERE idgoods = ?", [id], (err, result) => {
    if (err) {
      console.error("DB delete error:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json({ success: true });
  });
});



app.post('/products', (req, res) => {
  const { name, categorie, about, color, quantity_in_stock, default_price, discount, image, supplier_id } = req.body;
  console.log("hyi"+categorie);

  // ПІДЛАШТУЙ під свої колонки в таблиці goods !!!
  const sql =
    "INSERT INTO goods (name, categorie, about, color, quantity_in_stock, default_price, discount, image, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

  con.query(
    sql,
    [name, categorie, about, color, quantity_in_stock, default_price, discount, image, supplier_id],
    (err, result) => {
      if (err) {
        console.error("DB insert error:", err);
        return res.status(500).json({ message: "DB error" });
      }
      res.status(201).json({ idgoods: result.insertId });
    }
  );
});


app.listen(3002, () => {
    console.log("running on port 3002");
})