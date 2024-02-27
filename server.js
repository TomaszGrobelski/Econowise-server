import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
app.get('/', (req, res) => {
  res.json(shoppingList);
});

app.get('/shopping-list', (req, res) => {
  res.json(shoppingList);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('server on'));
