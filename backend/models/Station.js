const mongoose = require('mongoose');

// Define the schema for the stations collection
const stationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  // Add other fields as needed
}, { collection: 'stations' });

const stations = mongoose.model(`Station`, stationSchema);

module.exports = stations;
