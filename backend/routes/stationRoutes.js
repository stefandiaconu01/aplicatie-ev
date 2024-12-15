const express = require('express');
const router = express.Router();
const { getAllStations } = require('../controllers/stationController');

// GET all users
router.get('/', getAllStations);

module.exports = router;
