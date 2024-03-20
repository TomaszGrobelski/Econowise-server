import db from '../config/dbConfig.js';

export const getAllShoppingLists = (req, res) => {
  const selectQuery = 'SELECT * FROM shoppings';
  db.query(selectQuery, (selectErr, results) => {
    if (selectErr) {
      console.log(selectErr.message);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
};

export const addNewShoppingList = (req, res) => {
  const { name, category, items } = req.body;

  const insertQuery = 'INSERT INTO shoppings (name, category, items) VALUES (?, ?, ?)';

  db.query(insertQuery, [name, category, JSON.stringify(items)], (insertErr, results) => {
    if (insertErr) {
      console.log(insertErr.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ message: 'Shopping list added successfully', id: results.insertId });
  });
};

export const deleteShoppingList = (req, res) => {
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
};

export const addNewItem = (req, res) => {
  const id = req.params.id;
  const { newItem } = req.body;
  const selectQuery = 'SELECT * FROM shoppings WHERE id=?';

  db.query(selectQuery, [id], (selectErr, results) => {
    if (selectErr) {
      console.log(selectErr.message);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: `Shopping list with ID ${id} not found.` });
    }
    const shoppingList = results[0];
    const currentItems = JSON.parse(shoppingList.items) || [];
    currentItems.push(newItem);

    const updateQuery = 'UPDATE shoppings SET items=? WHERE id=?';

    db.query(updateQuery, [JSON.stringify(currentItems), id], updateErr => {
      if (updateErr) {
        console.log(updateErr.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      res.json({ message: 'Item added to shopping list successfully', newItem, shoppingList });
    });
  });
};
