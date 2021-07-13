const express = require('express');
const { body } = require('express-validator/check');
const router = express.Router();
const timeController = require('../../controllers/time');
const isAuth = require('../../middleware/is-auth');
//router.get('/',shopController.getProducts);
//router.get('/product/:productId',shopController.getProduct);
router.get('/card', isAuth, timeController.getCard);
router.post('/card', 
[
    body('activity')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
isAuth, timeController.postCard);
router.get('/total', isAuth, timeController.getTotal);
router.get('/totalbyemployee', isAuth, timeController.getTotalByEmployee);
router.get('/about', timeController.aboutTime);
//router.get('/card', isAuth, timeController.getCard);
//router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
//router.post('/create-order', isAuth, shopController.postOrder);
//router.get('/orders', isAuth, shopController.getOrders);

module.exports = router;