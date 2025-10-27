const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const clientSpaceRoutes = require("./routes/clientSpaceRoutes");
const contactRoutes = require("./routes/contactRoutes");


const app = express();


const requiredEnv = [
  "DB_CONNECTION_STRING",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
const missing = requiredEnv.filter((k) => !process.env[k]);
if (missing.length > 0) {
  console.warn(`Missing required environment variables: ${missing.join(", ")}`);
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  console.warn("Refresh token secret (REFRESH_TOKEN_SECRET) is not set. You are using access tokens only.");
}



const allowlist = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'https://studioph.netlify.app/')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowlist.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(bodyParser.json({ limit: process.env.BODY_LIMIT || '1mb' }));
app.use(cookieParser());


app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/auth", userRoutes);
app.use("/category", categoryRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/client-space", clientSpaceRoutes);
app.use("/contact", contactRoutes);

const { errorMiddleware } = require('./middlewares/errorMiddleware');
app.use(errorMiddleware);


const PORT = process.env.PORT || 3000;

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();
    console.log('Database connected successfully');
    
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      // Handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`Port ${PORT} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
