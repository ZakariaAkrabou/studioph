const express = require("express");
const router = express.Router();
const { singleUpload } = require("../middlewares/upload");
const categoryController = require("../controllers/categoryController");
const { protectAdmin } = require("../middlewares/authMiddleware");

router.post("/create", protectAdmin, singleUpload("image", "categories"), categoryController.createCategory);
router.put("/update/:id", protectAdmin, singleUpload("image", "categories"), categoryController.updateCategory);
router.delete("/delete/:id", protectAdmin, categoryController.deleteCategory);


// Public
router.get("/all", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);

module.exports = router;
