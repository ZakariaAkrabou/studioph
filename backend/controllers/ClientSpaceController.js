const ClientSpace = require("../models/ClientSpace");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;

exports.createClientSpace = async (req, res) => {
  try {
    const { name, key } = req.body;

    if (!name || !key) {
      return res.status(400).json({ message: "Name and key are required" });
    }

    // Check for existing space with the same name
    const existingSpace = await ClientSpace.findOne({ name });
    if (existingSpace) {
      return res
        .status(400)
        .json({ message: "A client space with this name already exists" });
    }

    const keyHash = await bcrypt.hash(key, 10);

    const space = await ClientSpace.create({
      name,
      key: keyHash,
      admin: req.admin.id,
      images: [],
    });

    res.status(201).json({ message: "Client space created", space });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating client space", error: error.message });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const spaceId = req.params.id;
    const space = await ClientSpace.findById(spaceId);

    if (!space) {
      return res.status(404).json({ message: "Client space not found" });
    }

    const uploadedUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `space_images/${spaceId}`,
      });
      uploadedUrls.push(result.secure_url);
    }

    space.images.push(...uploadedUrls);
    await space.save();

    res.status(200).json({ message: "Images uploaded", images: uploadedUrls });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error uploading images", error: error.message });
  }
};

exports.accessClientSpace = async (req, res) => {
  try {
    const spaceId = req.params.id;
    const { key } = req.body; 
    if (!key) return res.status(400).json({ message: "Key is required" });

    const space = await ClientSpace.findById(spaceId);
    if (!space) {
      return res.status(404).json({ message: "Client space not found" });
    }

    const isMatch = await bcrypt.compare(key, space.key); 
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid key" });
    }

    res.status(200).json({
      message: "Access granted",
      name: space.name,
      images: space.images,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error accessing client space", error: error.message });
  }
};

exports.getAllSpaces = async (req, res) => {
  try {
    const spaces = await ClientSpace.find({ admin: req.admin._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      spaces,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: err.message,
    });
  }
};

exports.updateSpace = async (req, res) => {
  try {
    const space = await ClientSpace.findById(req.params.id);
    if (!space) return res.status(404).json({ message: "Space not found" });
    if (!space.admin.equals(req.admin._id))
      return res.status(403).json({ message: "Not authorized" });

    const { name, key } = req.body || {};


    if (name) space.name = name;
    if (key) {
      const hashedKey = await bcrypt.hash(key, 10);
      space.key = hashedKey;
     
    }

    await space.save();
   

    res.json({ success: true, message: "Space updated", space });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error updating space", error: err.message });
  }
};

exports.deleteSpace = async (req, res) => {
  const space = await ClientSpace.findById(req.params.id);
  if (!space) return res.status(404).json({ message: "Space not found" });
  if (!space.admin.equals(req.admin._id))
    return res.status(403).json({ message: "Not authorized" });

  await space.deleteOne();
  res.status(200).json({  message: "Space deleted" });
};
