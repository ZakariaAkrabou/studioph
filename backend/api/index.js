const serverless = require('serverless-http');
const app = require('../app');
const connectDB = require('../config/database');

let isConnected = false;

module.exports = async (req, res) => {
  try {
    if (!isConnected) {
      // Ensure DB is connected once in cold start
      await connectDB();
      isConnected = true;
    }
    const handler = serverless(app);
    return handler(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



