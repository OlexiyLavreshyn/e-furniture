const con = require('./config/db.js').default;

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
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




function generateVerificationCode() {
    const min = 10000;
    const max = 99999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


app.post('/register', async (req, res) => {
  const { name, email, phone_number, password: plainPassword } = req.body;
  const verificationCode = generateVerificationCode(); // Generate a 5-digit code
  const active = 1;

  console.log("Request received at /register");

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    // Insert user data into the database using async/await
    const [result] = await con.query(
      "INSERT INTO users (name, email, phone_number, password, verification_code, active) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone_number, hashedPassword, verificationCode, active]
    );

    res.status(201).json({
      message: "User registered successfully",
      insertId: result.insertId
    });
  } catch (err) {
    console.error("Error registering user:", err);

    // Handle duplicate email error (if your DB has unique constraint)
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});




app.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);

  try {
    const [results] = await con.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (results.length === 0) {
      console.log('no user');
      return res.status(401).send({ message: 'Wrong email' });
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('not logged');
      return res.status(401).send({ message: 'Wrong email or password' });
    }

    console.log('logged');

    const token = jwt.sign(
      { userId: user.idusers, role: user.role },
      'jktrxsw2005',
      { expiresIn: '1h' }
    );

    console.log(token);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: true, // true in production
      sameSite: 'strict',
      maxAge: 36000000,
    });

    res.status(200).json({
      message: 'Login successful',
      email_verified_at: user.email_verified_at,
    });
  } catch (err) {
    console.error('Error querying the database:', err);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


function authMiddleware(req, res, next) {
  const token = req.cookies.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, 'jktrxsw2005');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}



app.get('/profile', authMiddleware, (req, res) => {
  user_id = req.user.userId;

  try {
  con.query(
  "SELECT name, email, phone_number FROM users WHERE idusers = ?",
  [user_id],
  (err, result) => {
  if (result) {
    res.send(result);
  } else {
    console.log(err);
  }
  }
  );
  } catch (err) {
    console.error("Error registering user: " + err);
    res.status(500).send({ message: "Internal Server Error" });
  }   
});

app.listen(3001, () => {
    console.log("running on port 3001");
})
