const { Team } = require('../models');

module.exports = {
    getTeams: async (req, res) => {
        try {
            const user = checkUser(req, res, next)
            if(user) {
                const teams = await Team.find({ createdBy: user})
                res.status(200).json(teams)
            } else {
                throw new Error("No autorizado", {cause: 401})
            }
        } catch(e) {
            res.status(e?.cause ? e.cause : 400).json({ message: e.message })
        }
    },
    
    postTeam: async (req, res) => {
        try {
            const user = checkUser(req, res, next)
            if(user) {
                const { body } = req;
                const newTeam = new Team(body);
                newTeam.save()
                    .then(team => res.status(201).json(team))
                    .catch(err => res.status(400).json({ message: err.message }))
            } else {
                throw new Error("No autorizado", {cause: 401})
            }
        } catch(e) {
            res.status(e?.cause ? e.cause : 400).json({ message: e.message })
        }
    },
    
    putTeam: async (req, res) => {
        try {
        } catch(e) {
        }
    },
    
    deleteTeam: async (req, res) => {
        try {
        } catch(e) {
        }
    },
}
