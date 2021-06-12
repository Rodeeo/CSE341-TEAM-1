const path = require('path');
const express = require('express');
//const timecardController = require('controllers/timecard');


const timecardController = require('../controllers/timecard');

const router = express.Router();

router.get('/', timecardController.getTime);
router.get('/enterTime', timecardController.enterTime);
router.get('/totalTime', timecardController.totalTime);
module.exports = router;