const path = require('path');
const express = require('express');
const { body } = require('express-validator/check');
const adminController = require('../../controllers/admin');
const isAuth = require('../../middleware/is-auth');
const router = express.Router();


module.exports = router;
