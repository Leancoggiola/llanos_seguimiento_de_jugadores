const jwt = require('jsonwebtoken');
const { User } = require('../endpoints/models');

module.exports = {
    verifyToken: async (req, res, next) => {
        const bearerHeader = req.headers['authorization'];
        if (bearerHeader) {
            const token = bearerHeader.split(' ')[1];
            if (token) {
                const tokenData = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) res.clearCookie('jwt').sendStatus(403);
                    return decoded;
                });

                const user = await User.findById(tokenData.id);
                if (user) {
                    req.token = tokenData.id;
                    next();
                } else {
                    res.clearCookie('jwt').sendStatus(403);
                }
            } else {
                res.clearCookie('jwt').sendStatus(403);
            }
        } else {
            res.clearCookie('jwt').sendStatus(403);
        }
    },
};
