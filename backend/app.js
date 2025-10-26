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



const allowlist = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || 'http://localhost:5173')
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
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
