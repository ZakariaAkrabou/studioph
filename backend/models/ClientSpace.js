// models/ClientSpace.js
const mongoose = require('mongoose');

const clientSpaceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    key: { type: String, required: true }, 
    images: [{ type: String }], 
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }

}, { timestamps: true });

module.exports = mongoose.model('ClientSpace', clientSpaceSchema);
