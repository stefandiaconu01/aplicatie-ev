require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Seed data
async function seedUsers() {
  await User.deleteMany(); // Clear existing users, optional
  await User.insertMany([
    { name: 'Ace', email: 'alice@example.com' },
    { name: 'Bob', email: 'bob@example.com' },
    { name: 'Charlie', email: 'charlie@example.com' },
  ]);
  console.log('Database seeded!');
  mongoose.connection.close();
}

seedUsers();