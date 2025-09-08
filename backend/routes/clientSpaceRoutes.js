const express = require("express");
const router = express.Router();
const ClientSpaceController = require("../controllers/ClientSpaceController");
const { protectAdmin } = require("../middlewares/authMiddleware"); 
const { multipleUpload, singleUpload } = require("../middlewares/upload");
const { createRateLimiter } = require("../utils/rateLimit");


router.get("/public", ClientSpaceController.getPublicSpaces);
router.post("/create", protectAdmin, ClientSpaceController.createClientSpace);
router.post("/upload/:id/images",protectAdmin,multipleUpload("images", 10, "space_images"),ClientSpaceController.uploadImages);


const accessLimiter = createRateLimiter({ windowMs: 15 * 60 * 1000, max: 10 });
router.post("/:id/access", accessLimiter, ClientSpaceController.accessClientSpace);
router.get("/all-space",  protectAdmin,ClientSpaceController.getAllSpaces);
router.put("/update/:id", protectAdmin, ClientSpaceController.updateSpace);
router.delete("/delete/:id", protectAdmin, ClientSpaceController.deleteSpace);

// individual images
router.delete("/:id/image", protectAdmin, ClientSpaceController.removeImage);
router.put("/:id/image/:index",protectAdmin,singleUpload("image", "space_images"),ClientSpaceController.replaceImage
);


module.exports = router;
