const { User, Team, Tournament, Player } = require('../models.js');
const jwt = require('jsonwebtoken');

module.exports = {
    // Status
    login: async (req, res) => {
        const { username, password } = req.body; 
        try {
            const user = await User.login(username, password).catch(err => res.status(400).json({ message: err.message }))
            const jwtToken = jwt.sign(
                { id: user._id, username: user.username}, 
                process.env.JWT_SECRET,
                { expiresIn: 1*24*60*60 }
            )
            res.cookie("jwt", jwtToken, { withCredentials: true, httpOnly: false, maxAge: 1*24*60*60*1000})
            res.status(200).json({ message: "Logeado"})
        } catch(e) {
            res.status(e?.status ? e.status : 404).json({ message: e.message })
        }
    },

    postUser: async (req, res) => {
        const { username, password, secret } = req.body; 
        try {
            if(secret !== process.env.REGISTER_SECRET) {
                res.status(401).json({ message: "No puedes registrarte en esta app"})
            } else {
                const user = await User.create({username, password}).catch(err => res.status(400).json({ message: err.message }))
                const jwtToken = jwt.sign(
                        { id: user._id, username: user.username}, 
                        process.env.JWT_SECRET,
                        { expiresIn: 1*24*60*60 }
                    )
                res.cookie("jwt", jwtToken, { withCredentials: true, httpOnly: false, maxAge: 1*24*60*60*1000})
                res.status(201).json({ message: "Registrado con exito"})
            }
        } catch(e) {
            res.status(e?.status ? e.status : 404).json({ message: e.message })
        }
    },

    deleteUser: async (req, res) => {
        const { username } = req.body;
        try {
            const user = await User.findOne({username})
            Tournament.deleteMany({createdBy: user._id}).catch(err => res.status(400).json({ message: err.message }))
            Team.deleteMany({createdBy: user._id}).catch(err => res.status(400).json({ message: err.message }))
            Player.deleteMany({createdBy: user._id}).catch(err => res.status(400).json({ message: err.message }))
            
            User.deleteOne({username}).catch(err => res.status(400).json({ message: err.message }))
                .then(() => res.status(200).json("Eliminado con exito"))
                .catch(err => res.status(400).json({ message: err.message }))
        } catch(e) {
            res.status(e?.status ? e.status : 404).json({ message: e.message })
        }
    }
}
