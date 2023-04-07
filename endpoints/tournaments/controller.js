const { checkUser } = require('../../middlewares/AuthMiddlewares.js');
const { Tournament } = require('../models.js');

module.exports = {
    // Tournaments
    getTournaments: async (req, res, next) => {
        try {
            const user = checkUser(req, res, next)
            if(user) {
                const tourneys = await Tournament.find({ createdBy: user})
                res.status(200).json(tourneys)
            } else {
                throw new Error("No autorizado", {cause: 401})
            }
        } catch(e) {
            res.status(e?.cause ? e.cause : 400).json({ message: e.message })
        }
    },

    deleteTournaments: async (req, res) => {
        try {
        } catch(e) {
        }
    },

    postTournaments: async (req, res) => {
        try {
            const user = checkUser(req, res, next)
            if(user) {
                const { body } = req;
                const newTournament = new Tournament(body);
                newTournament.save()
                    .then(tourney => res.status(201).json(tourney))
                    .catch(err => res.status(400).json({ message: err.message }))
            } else {
                throw new Error("No autorizado", {cause: 401})
            }
        } catch(e) {
            res.status(e?.cause ? e.cause : 400).json({ message: e.message })
        }
    },

    putTournaments: async (req, res) => {
        try {
        } catch(e) {
        }
    }
}
