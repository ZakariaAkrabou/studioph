const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


exports.registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "User already exists" });
        }

        const admin = new Admin({  email, password });
        const verificationToken = admin.generateVerificationToken();
        await admin.save();

        const frontendBase = (process.env.FRONTEND_URL || process.env.FRONTEND_URLS?.split(',')[0] || 'http://localhost:5173').trim();
        const verifyUrl = `${frontendBase.replace(/\/+$/, '')}/auth/verify/${verificationToken}`;
        await sendEmail(email, "Verify Your Admin Account", `<p>Click here to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`);

        res.status(200).json({ message: "Verification email sent" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.verifyEmail = async (req, res) => {
    try {
        const admin = await Admin.findOne({ verificationToken: req.params.token });
        if (!admin) return res.status(400).json({ message: "Invalid token" });

        admin.isVerified = true;
        admin.verificationToken = undefined;
        await admin.save();
        res.json({ message: "Email verified" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "User with this email does not exist." });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    if (!admin.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        email: admin.email,
        isVerified: admin.isVerified,
      },
    });
  } catch (err) {
    console.error("Login Admin Error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
};


exports.checkAuth = async (req, res) => {
    try {
       
        res.json({ 
            isValid: true,
            user: {
                id: req.admin._id,
                email: req.admin.email,
                isVerified: req.admin.isVerified
            }
        });
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const admin = await Admin.findOne({ email: req.body.email });
        if (!admin) return res.status(404).json({ message: "Email not found" });

        const resetToken = admin.generatePasswordResetToken();
        await admin.save();

        const frontendBase = (process.env.FRONTEND_URL || process.env.FRONTEND_URLS?.split(',')[0] || 'http://localhost:5173').trim();
        const resetUrl = `${frontendBase.replace(/\/+$/, '')}/auth/reset-password/${resetToken}`;
        await sendEmail(admin.email, "Password Reset", `<p>Click to reset password: <a href="${resetUrl}">${resetUrl}</a></p>`);

        res.json({ message: "Password reset email sent" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const admin = await Admin.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!admin) return res.status(400).json({ message: "Invalid or expired token" });

        admin.password = req.body.newPassword;
        admin.resetPasswordToken = undefined;
        admin.resetPasswordExpire = undefined;
        await admin.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
