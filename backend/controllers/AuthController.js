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
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        const admin = await Admin.findOne({ verificationToken: hashedToken });
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

    const accessExpiresIn = process.env.JWT_EXPIRATION || '15m';
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRATION || '7d';

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: accessExpiresIn }
    );

    const refreshToken = jwt.sign(
      { id: admin._id },
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
      { expiresIn: refreshExpiresIn }
    );

    
    const refreshPayload = jwt.decode(refreshToken);
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(refreshPayload.exp * 1000);
    admin.refreshTokens = (admin.refreshTokens || []).filter((t) => t.expiresAt > new Date());
    admin.refreshTokens.push({ tokenHash, expiresAt });
    await admin.save();

    const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
    const sameSite = 'Strict';
    const secure = isProd;
    const cookieOpts = {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
    };
    // Access token: short-lived, HttpOnly cookie
    res.cookie('access_token', token, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
    // Refresh token: longer-lived, HttpOnly cookie
    res.cookie('refresh_token', refreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({
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

exports.refreshAccessToken = async (req, res) => {
  try {
    const tokenFromCookie = req.cookies && req.cookies.refresh_token;
    const presented = tokenFromCookie || (req.body && req.body.refreshToken);
    if (!presented) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }
    const decoded = jwt.verify(presented, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ message: 'Invalid refresh token' });

    // validate against allowlist
    const presentedHash = crypto.createHash('sha256').update(presented).digest('hex');
    const stored = (admin.refreshTokens || []).find((t) => t.tokenHash === presentedHash && t.expiresAt > new Date());
    if (!stored) return res.status(401).json({ message: 'Invalid refresh token' });

    // rotate token: remove old, issue new
    admin.refreshTokens = admin.refreshTokens.filter((t) => t.tokenHash !== presentedHash && t.expiresAt > new Date());

    const accessExpiresIn = process.env.JWT_EXPIRATION || '15m';
    const newAccessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: accessExpiresIn });
    const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRATION || '7d';
    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET,
      { expiresIn: refreshExpiresIn }
    );
    const newPayload = jwt.decode(newRefreshToken);
    const newHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    admin.refreshTokens.push({ tokenHash: newHash, expiresAt: new Date(newPayload.exp * 1000) });
    await admin.save();

    const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
    const sameSite = 'Strict';
    const secure = isProd;
    const cookieOpts = {
      httpOnly: true,
      secure,
      sameSite,
      path: '/',
    };
    res.cookie('access_token', newAccessToken, { ...cookieOpts, maxAge: 15 * 60 * 1000 });
    res.cookie('refresh_token', newRefreshToken, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 });

    res.json({ success: true });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};
