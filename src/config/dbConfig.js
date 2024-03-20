import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const db = mysql.createConnection({
  host: process.env.MYSQL_DB_URL,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB_NAME,
});

db.connect(err => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log('Database connected');

  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS shoppings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        items JSON NOT NULL
      )`;

  db.query(createTableQuery, createTableErr => {
    if (createTableErr) {
      console.log(createTableErr.message);
      return;
    }
    console.log('shopping lists table created or already exists');
  });
});

export default db;
