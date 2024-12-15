require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('./config/db'); // MongoDB connection
const userRoutes = require('./routes/userRoutes');
const stationRoutes = require('./routes/stationRoutes')
const authenticate = require('./middleware/authenticate');

const app = express();
app.use(express.json()); // Parse JSON bodies

const cors = require('cors');
app.use(cors({ origin: '*' })); // Allow all origins

// Routes
app.use('/api/auth', userRoutes); // Route for user-related API
app.use('/api/stations', stationRoutes);
app.use('/api/protected', authenticate, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
