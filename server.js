import express from 'express';

const app = express();

const shoppingList = [
  {
    id: 1,
    name: 'Lista spożywcza',
    items: [
      { name: 'Chleb', quantity: 2 },
      { name: 'Mleko', quantity: 1 },
      { name: 'Jajka', quantity: 12 },
    ],
  },
  {
    id: 2,
    name: 'Lista chemii gospodarczej',
    items: [
      { name: 'Mydło', quantity: 3 },
      { name: 'Papier toaletowy', quantity: 6 },
      { name: 'Płyn do mycia naczyń', quantity: 1 },
    ],
  },
];
app.get('/shopping-list', (req, res) => {
  res.json(shoppingList);
});

app.listen(3000, () => console.log('server on'));
