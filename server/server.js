// Polyfill WebCrypto for Node runtime compatibility with Mongoose 9 / MongoDB BSON
if (!globalThis.crypto) {
  try {
    globalThis.crypto = require('crypto').webcrypto;
  } catch (e) {
    globalThis.crypto = require('crypto');
  }
}

const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Allow all CORS origins for client requests
app.use(cors({ origin: '*' }));
app.use(express.json());

// Liveness / Health check endpoint for Docker, Kubernetes & CI/CD probes
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'Smart Campus API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Core REST API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/booking', require('./routes/booking'));
app.use('/api/gatepass', require('./routes/gatepass'));
app.use('/api/library', require('./routes/library'));
app.use('/api/notices', require('./routes/notice'));
app.use('/api/complaints', require('./routes/complaint'));
app.use('/api/lostfound', require('./routes/lostfound'));
app.use('/api/ai', require('./routes/ai'));

// Serve static frontend files from client folder if present
const clientPath = path.join(__dirname, '../client');
const inContainerClientPath = path.join(__dirname, 'client');
if (require('fs').existsSync(clientPath)) {
  app.use(express.static(clientPath));
} else if (require('fs').existsSync(inContainerClientPath)) {
  app.use(express.static(inContainerClientPath));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Smart Campus server running on http://localhost:${PORT}`));

module.exports = app;
