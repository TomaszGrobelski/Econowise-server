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

app.get('/shopping', (req, res) => {
  const selectQuery = 'SELECT * FROM shoppings';
  db.query(selectQuery, (selectErr, results) => {
    if (selectErr) {
      console.log(selectErr.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

app.post('/shopping', (req, res) => {
  const { name, category, items } = req.body;

  const insertQuery = 'INSERT INTO shoppings (name, category, items) VALUES (?, ?, ?)';

  db.query(insertQuery, [name, category, JSON.stringify(items)], (insertErr, results) => {
    if (insertErr) {
      console.log(insertErr.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ message: 'Shopping list added successfully', id: results.insertId });
  });
});

app.delete('/shopping/clear/:id', (req, res) => {
  // const { id } = req.params;
  const id = req.params.id;
  console.log('Deleting shopping list with ID:', id);
  const deleteQuery = 'DELETE FROM shoppings WHERE id=?';

  db.query(deleteQuery, [id], deleteErr => {
    if (deleteErr) {
      console.log(deleteErr.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: `Shopping list with ID ${id} deleted successfully` });
  });
});

app.get('/shopping/create', (req, res) => {
  const newList = {
    name: 'Nowa lista',
    category: 'Inna kategoria',
    items: [],
  };

  const insertQuery = 'INSERT INTO shoppings (name, category, items) VALUES (?, ?, ?)';

  db.query(
    insertQuery,
    [newList.name, newList.category, JSON.stringify(newList.items)],
    (insertErr, results) => {
      if (insertErr) {
        console.log(insertErr.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ message: 'New shopping list created successfully', id: results.insertId });
    }
  );
});

app.get('/', (req, res) => {
  res.json('Czesc');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
