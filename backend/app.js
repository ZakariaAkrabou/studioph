const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.use("/auth", userRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
