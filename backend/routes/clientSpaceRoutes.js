const express = require("express");
const router = express.Router();
const multer = require("multer");
const ClientSpaceController = require("../controllers/ClientSpaceController");
const { protectAdmin } = require("../middlewares/authMiddleware"); 
const upload = multer({ dest: "uploads/" });


router.post("/create", protectAdmin, ClientSpaceController.createClientSpace);
router.post("/upload/:id/images", protectAdmin, upload.array("images", 10), ClientSpaceController.uploadImages);
router.post("/:id/access", ClientSpaceController.accessClientSpace);
router.get("/all-space", protectAdmin, ClientSpaceController.getAllSpaces);
router.put("/update/:id", protectAdmin, ClientSpaceController.updateSpace);
router.delete("/delete/:id", protectAdmin, ClientSpaceController.deleteSpace);


module.exports = router;
