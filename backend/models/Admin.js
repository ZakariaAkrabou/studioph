const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

adminSchema.methods.generateVerificationToken = function () {
    this.verificationToken = crypto.randomBytes(32).toString('hex');
    return this.verificationToken;
};

adminSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

module.exports = mongoose.model('Admin', adminSchema);
