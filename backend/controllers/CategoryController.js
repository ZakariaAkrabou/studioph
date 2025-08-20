const Category = require("../models/Category");

exports.createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({  message: "Category already exists" });
    }

    let imageUrl = "";
    if (req.file && req.file.cloudinaryUrl) {
      imageUrl = req.file.cloudinaryUrl;
    }

    const category = await Category.create({
      name,
      description,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong!", error: error.message });
  }
};


exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong!", error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong!", error: error.message });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const { name, description } = req.body;
    
    // Only update fields that are provided
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    
    // Only update image if a new file is uploaded
    if (req.file && req.file.cloudinaryUrl) {
      category.image = req.file.cloudinaryUrl;
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({  message: "Something went wrong!", error: error.message });
  }
};


exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({  message: "Category not found" });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({  message: "Something went wrong!", error: error.message });
  }
};
