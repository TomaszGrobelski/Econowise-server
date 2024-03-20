import express from 'express';
import * as shoppingController from '../controllers/shoppingController.js';

const shoppingRoutes = express.Router();

shoppingRoutes.get('/shopping', shoppingController.getAllShoppingLists);
shoppingRoutes.post('/shopping', shoppingController.addNewShoppingList);
shoppingRoutes.delete('/shopping/clear/:id', shoppingController.deleteShoppingList);
shoppingRoutes.put('/shopping/item-add/:id', shoppingController.addNewItem)


export default shoppingRoutes;
