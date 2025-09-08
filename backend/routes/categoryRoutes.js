const express = require("express");
const router = express.Router();
const { singleUpload } = require("../middlewares/upload");
const categoryController = require("../controllers/CategoryController");
const { protectAdmin } = require("../middlewares/authMiddleware");
const { handleValidationErrors } = require("../middlewares/validationMiddleware");
const { validateCategoryId } = require("../validators/categoryValidators");

router.post("/create", protectAdmin, singleUpload("image", "categories"), categoryController.createCategory);
router.put("/update/:id", protectAdmin, singleUpload("image", "categories"), categoryController.updateCategory);
router.delete("/delete/:id", protectAdmin, categoryController.deleteCategory);


// Public
router.get("/all", categoryController.getCategories);
router.get("/:id",validateCategoryId,handleValidationErrors,categoryController.getCategoryById);

module.exports = router;
