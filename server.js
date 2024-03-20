import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import shoppingRoutes from './src/routes/shoppingRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(shoppingRoutes);

app.get('/', (req, res) => {
  res.json('Czesc');
});

// const PORT = process.env.PORT || 3000;
const PORT = 3000;
app.listen(PORT, () => console.log('Server running on port', PORT));
