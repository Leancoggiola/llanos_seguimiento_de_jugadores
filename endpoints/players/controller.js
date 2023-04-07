const { Player } = require('../models.js');

module.exports = {
    // Status
    getPlayers: async (req, res) => {
        try {
            const user = checkUser(req, res, next)
            if(user) {
                const players = await Player.find({ createdBy: user})
                res.status(200).json(players)
            } else {
                throw new Error("No autorizado", {cause: 401})
            }
        } catch(e) {
            res.status(e?.cause ? e.cause : 400).json({ message: e.message })
        }
    },

    postPlayer: async (req, res) => {
        try {
            const user = checkUser(req, res, next)
            if(user) {
                const { body } = req;
                const newPlayer = new Player(body);
                Player.save()
                    .then(player => res.status(201).json(player))
                    .catch(err => res.status(400).json({ message: err.message }))
            } else {
                throw new Error("No autorizado", {cause: 401})
            }
        } catch(e) {
            res.status(e?.cause ? e.cause : 400).json({ message: e.message })
        }
    },

    putPlayer: async (req, res) => {
        try {
            const { body } = req;
            Player.updateOne({ _id: body._id}, body)
                .then(() => res.status(200).json('Updated successfully'))
                .catch(err => res.status(400).json({ message: err.message }))
        } catch(e) {
            res.status(e?.status ? e.status : 400).json({ message: e.message })
        }
    },

    deletePlayer: async (req, res) => {
        try {
            const { body } = req;
            Player.remove(body)
                .then(() => res.status(200).json('Deleted successfully'))
                .catch(err => res.status(400).json({ message: err.message }))
        } catch(e) {
            res.status(e?.status ? e.status : 400).json({ message: e.message })
        }
    }
}
