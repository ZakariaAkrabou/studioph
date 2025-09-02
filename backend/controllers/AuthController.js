const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');


exports.registerAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = new Admin({  email, password });
        const verificationToken = admin.generateVerificationToken();
        await admin.save();

        const frontendBase = (process.env.FRONTEND_URL || process.env.FRONTEND_URLS?.split(',')[0] || 'http://localhost:5173').trim();
        const verifyUrl = `${frontendBase.replace(/\/+$/, '')}/auth/verify/${verificationToken}`;
        await sendEmail(email, "Verify Your Admin Account", `<p>Click here to verify: <a href="${verifyUrl}">${verifyUrl}</a></p>`);

        res.json({ message: "Verification email sent" });
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
        const admin = await Admin.findOne({ email });
        if (!admin || !(await admin.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (!admin.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ 
            token,
            user: {
                id: admin._id,
                email: admin.email,
                isVerified: admin.isVerified
            }
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
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
        if (!admin) return res.status(404).json({ message: "No admin found" });

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
