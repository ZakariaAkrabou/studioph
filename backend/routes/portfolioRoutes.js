const express = require("express");
const portfolioController = require("../controllers/PortfolioController");
const { singleUpload } = require("../middlewares/upload");
const { protectAdmin } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/all", portfolioController.getAllPortfolios);
router.get("/image/:id", portfolioController.getPortfolioById);


//private
router.post("/create",protectAdmin,singleUpload("image", "portfolio"), portfolioController.createPortfolio);
router.delete("/delete/:id", protectAdmin, portfolioController.deletePortfolio);

module.exports = router;
