const serverless = require('serverless-http');
const app = require('../app');
const connectDB = require('../config/database');

let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    // Ensure DB is connected once in cold start
    await connectDB();
    isConnected = true;
  }
  const handler = serverless(app);
  return handler(req, res);
};



