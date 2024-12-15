const Station = require('../models/Station');

exports.getAllStations = async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations:', error); // Debugging log
    res.status(500).json({ message: error.message });
  }
};
