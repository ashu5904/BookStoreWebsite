const express = require('express');
const router = express.Router();

const {
    loginController
} = require('../controllers/auth.controller.js');

router.post('/login', loginController);

module.exports = router;