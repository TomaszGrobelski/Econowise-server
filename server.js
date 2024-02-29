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

db.connect((err) => {
  if (err) {
    console.log(err.message);
    return;
  }
  console.log('Database connected');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS shopping_lists (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      items JSON NOT NULL
    )`;

  db.query(createTableQuery, (createTableErr) => {
    if (createTableErr) {
      console.log(createTableErr.message);
      return;
    }
    console.log('shopping_lists table created or already exists');
  });
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

app.post('/shopping-list', (req, res) => {
  const { name, category, items } = req.body;

  // Assuming you have a 'shopping_lists' table with columns: id, name, category, items (JSON)

  const insertQuery = 'INSERT INTO shopping_lists (name, category, items) VALUES (?, ?, ?)';

  db.query(insertQuery, [name, category, JSON.stringify(items)], (insertErr, results) => {
    if (insertErr) {
      console.log(insertErr.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Shopping list added successfully', id: results.insertId });
  });
});

app.delete('/shopping-list/clear-all', (req, res) => {
  const deleteQuery = 'DELETE FROM shopping_lists';

  db.query(deleteQuery, (deleteErr) => {
    if (deleteErr) {
      console.log(deleteErr.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'All shopping lists cleared successfully' });
  });
});

app.get('/', (req,res)=>{

  res.json("Czesc")
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
