const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');


const protectAdmin = async (req, res, next) => {
    const authHeaderToken = req.headers.authorization?.split(' ')[1];
    const cookieToken = req.cookies && req.cookies.access_token;
    const token = authHeaderToken || cookieToken;
    if (!token) return res.status(401).json({ message: 'Not authorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
      

        const admin = await Admin.findById(decoded.id);
        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        req.admin = admin; 
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = { protectAdmin };
