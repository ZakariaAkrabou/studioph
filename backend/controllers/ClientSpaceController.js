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

    // Files are already uploaded to Cloudinary by middleware; req.files contains secure URLs
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadedUrls = req.files.map((f) => f);

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
    if (!req.admin) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
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

exports.getPublicSpaces = async (_req, res) => {
  try {
    const spaces = await ClientSpace.find({}).sort({ createdAt: -1 });
    const publicSpaces = spaces.map((s) => ({
      _id: s._id,
      name: s.name,
      images: s.images,
      cover: s.images?.[0] || null,
      createdAt: s.createdAt,
    }));
    res.status(200).json({ success: true, spaces: publicSpaces });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Something went wrong", error: err.message });
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

exports.removeImage = async (req, res) => {
  try {
    const space = await ClientSpace.findById(req.params.id);
    if (!space) return res.status(404).json({ message: "Space not found" });
    if (!space.admin.equals(req.admin._id))
      return res.status(403).json({ message: "Not authorized" });

    const index = parseInt(req.query.index, 10);
    if (Number.isNaN(index) || index < 0 || index >= space.images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }

    space.images.splice(index, 1);
    await space.save();
    res.status(200).json({ success: true, images: space.images });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing image", error: err.message });
  }
};

exports.replaceImage = async (req, res) => {
  try {
    const space = await ClientSpace.findById(req.params.id);
    if (!space) return res.status(404).json({ message: "Space not found" });
    if (!space.admin.equals(req.admin._id))
      return res.status(403).json({ message: "Not authorized" });

    const index = parseInt(req.params.index, 10);
    if (Number.isNaN(index) || index < 0 || index >= space.images.length) {
      return res.status(400).json({ message: "Invalid image index" });
    }

    if (!req.file || !req.file.cloudinaryUrl)
      return res.status(400).json({ message: "No image provided" });

    space.images[index] = req.file.cloudinaryUrl;
    await space.save();

    res.status(200).json({ success: true, images: space.images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error replacing image", error: error.message });
  }
};