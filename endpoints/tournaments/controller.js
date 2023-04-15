const { errorHandler } = require('../helpers.js');
const { Tournament, Team } = require('../models.js');
const mongoose = require('mongoose')

module.exports = {
    // Tournaments
    getTournaments: async (req, res) => {
        const user = req?.token;
        try {
            const tourneys = await Tournament.find({ createdBy: user})
            res.status(200).json(tourneys)
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
        const user = req?.token;
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { body } = req;
            body["createdBy"] = user;
            if(body.teams) {
                const existing = await Team.find({ 'name': { $in: body.teams}}, null, {session})
                const newTeams = body.teams.filter(team => !existing.map(x => x.name).includes(team)) 
                const docs = await Team.create(newTeams.map(x => ({ name: x, players: [], createdBy: user})), {session})
                body.teams = [...docs, ...existing]
            }
            const newTournament = new Tournament(body);
            newTournament.save({session})
                .then(async tourney => {
                    await session.commitTransaction();
                    session.endSession()
                    res.status(201).json(tourney)
                })
                .catch(async err => {
                    await session.abortTransaction();
                    session.endSession()
                    errorHandler(err, res)
                })
        } catch(e) {
            await session.abortTransaction();
            session.endSession()
            errorHandler(err, res)
        }
    },

    putTournaments: async (req, res) => {
        try {
        } catch(e) {
        }
    }
}
