// const path = require('path');
const express = require('express');
//const timecardController = require('controllers/timecard');


const timecardController = require('../controllers/timecard');

const router = express.Router();

router.get('/', timecardController.getTime);
router.get('/enterTime', timecardController.enterTime);
router.get('/totalTime', timecardController.totalTime);
router.get('/totalTime/:date1/:date2', timecardController.totalTime);
router.get('/about', timecardController.aboutTime);
router.get('/login', timecardController.loginTime);
router.get('/signup', timecardController.signupTime);

module.exports = router;