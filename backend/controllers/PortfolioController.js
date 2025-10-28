const Portfolio = require("../models/Portfolio");
const Category = require("../models/Category");

exports.createPortfolio = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title || !category) {
      return res
        .status(400)
        .json({ success: false, message: "Title and category are required" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const imageUrl = req.file?.cloudinaryUrl;
    if (!imageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    const portfolio = await Portfolio.create({
      title,
      description,
      imageUrl,
      category,
      photographer: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: "Portfolio item created successfully",
      data: portfolio,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000 && err.keyPattern && err.keyPattern.title) {
      return res
        .status(400)
        .json({
          message: "A portfolio with this title already exists",
        });
    }
    res
      .status(500)
      .json({
        success: false,
        message: "Something went wrong",
        error: err.message,
      });
  }
};

exports.getAllPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find()
      .populate("category", "name")
      .populate("photographer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: portfolios.length,
      data: portfolios,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id)
      .populate("category", "name")
      .populate("photographer", "name email");

    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio item not found" });
    }

    res.status(200).json({ success: true, data: portfolio });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res
        .status(404)
        .json({ success: false, message: "Portfolio item not found" });
    }

    if (portfolio.photographer.toString() !== req.admin._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Portfolio.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ success: true, message: "Portfolio item deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

// Update portfolio item
exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ success: false, message: "Portfolio item not found" });
    }

    // Authorization: allow any authenticated admin to update

    const { title, description, category } = req.body || {};
    if (title) portfolio.title = title;
    if (description) portfolio.description = description;
    if (category) portfolio.category = category;
    if (req.file && req.file.cloudinaryUrl) {
      portfolio.imageUrl = req.file.cloudinaryUrl;
    }

    await portfolio.save();

    res.status(200).json({ success: true, message: "Portfolio item updated", data: portfolio });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};