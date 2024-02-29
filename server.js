import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
});

app.get('/shopping-list', (req, res) => {
  const selectQuery = 'SELECT * FROM shopping_lists';
  db.query(selectQuery, (selectErr, results) => {
    if (selectErr) {
      console.log(selectErr.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
