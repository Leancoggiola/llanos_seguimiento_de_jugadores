const { User } = require('../endpoints/models.js');
const jwt = require('jsonwebtoken');


module.exports.checkUser = (req) => {
    const token = req.cookies.jwt;
    if(token) {
        const tokenData =jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) throw new Error("No autorizado", {cause: 401})
            return decoded
        })
        return tokenData.id
    } else {
        throw new Error("No autorizado", {cause: 401})
    }
}