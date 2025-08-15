const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const portfolioRoutes = require("./routes/portfolioRoutes");
const clientSpaceRoutes = require("./routes/clientSpaceRoutes");


const app = express();

app.use(bodyParser.json());

app.use("/auth", userRoutes);
app.use("/category", categoryRoutes);
app.use("/portfolio", portfolioRoutes);
app.use("/client-space", clientSpaceRoutes);

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
