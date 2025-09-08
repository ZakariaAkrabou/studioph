const express = require("express");
const portfolioController = require("../controllers/PortfolioController");
const { singleUpload } = require("../middlewares/upload");
const { protectAdmin } = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../middlewares/validationMiddleware");
const { validatePortfolioId } = require("../validators/portfolioValidators");

const router = express.Router();

router.get("/all", portfolioController.getAllPortfolios);
router.get(
  "/image/:id",
  validatePortfolioId,
  handleValidationErrors,
  portfolioController.getPortfolioById
);


//private
router.post("/create", protectAdmin, singleUpload("image", "portfolio"), portfolioController.createPortfolio);
router.put("/update/:id", protectAdmin, singleUpload("image", "portfolio"), portfolioController.updatePortfolio);
router.delete("/delete/:id", protectAdmin, portfolioController.deletePortfolio);

module.exports = router;
