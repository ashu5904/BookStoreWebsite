const express = require('express');
const router = express.Router();

const {
    productFetchController, addCartController
} = require('../controllers/product.controllers');

router.post('/fetch', productFetchController);
router.post('/addCart', addCartController);

module.exports = router;