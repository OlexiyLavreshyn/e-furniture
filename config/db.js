import mysql from 'mysql2/promise';

const con = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


(async () => {
  try {
    const conn = await con.getConnection();
    console.log('✅ Database connected');
    conn.release();
  } catch (err) {
    console.error('❌ Database connection failed', err);
    process.exit(1);
  }
})();



export default con;
