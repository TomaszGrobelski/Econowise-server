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
    CREATE TABLE IF NOT EXISTS shopping_lists (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      item_name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL
    )
  `;

  db.query(createTableQuery, createTableErr => {
    if (createTableErr) {
      console.log(createTableErr.message);
      return;
    }
    console.log('Table created or already exists');

    const shoppingList = [
      {
        name: 'Lista spożywcza',
        category: 'spoæywczne',
        items: [
          { name: 'Chleb', quantity: 2 },
          { name: 'Mleko', quantity: 1 },
          { name: 'Jajka', quantity: 12 },
        ],
      },
      {
        name: 'Lista chemii gospodarczej',
        category: 'dom i ogród',
        items: [
          { name: 'Mydło', quantity: 3 },
          { name: 'Papier toaletowy', quantity: 6 },
          { name: 'Płyn do mycia naczyń', quantity: 1 },
        ],
      },
    ];

    const insertQuery = `
    INSERT INTO shopping_lists (name, category, item_name, quantity)
    VALUES
    ${shoppingList
      .flatMap(list =>
        list.items.map(
          item => `("${list.name}", "${list.category}", "${item.name}", ${item.quantity})`
        )
      )
      .join(', ')}
  `;

    db.query(insertQuery, insertErr => {
      if (insertErr) {
        console.log(insertErr.message);
        return;
      }
      console.log('Data added to the database');
    });
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

app.get('/mysql-user', (req, res) => {
  const mysqlUser = process.env.MYSQL_USER;
  const mysqlPassword = process.env.MYSQL_PASSWORD;
  res.json({ mysqlUser, mysqlPassword });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
