const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        console.log('Auth Headers:', req.headers);
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Token:', token);

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded);
        
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Auth Error:', err);
        res.status(401).json({ message: 'Token is not valid', error: err.message });
    }
}; 