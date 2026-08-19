const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Resource = require('./models/Resource');

dotenv.config();

const sampleResources = [
  { name: '3D Printer Lab', category: 'Equipment', location: 'Tech Block Room 102' },
  { name: 'Main Seminar Hall', category: 'Hall', location: 'Central Auditorium Floor 1' },
  { name: 'High-Performance PC 01', category: 'Computer', location: 'CS Lab 3' },
  { name: 'Robotics Kit A', category: 'Equipment', location: 'Robotics Center' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Resource.deleteMany({});
    await Resource.insertMany(sampleResources);
    console.log('Sample campus resources added successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
