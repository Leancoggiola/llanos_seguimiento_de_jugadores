const { Team } = require('../models');
const mongoose = require('mongoose');

module.exports = {
    getTeams: async (req, res) => {
        const user = req?.token;
        try {
            const teams = await Team.find({ createdBy: user})
            res.status(200).json(teams)
        } catch(e) {
            res.status(e?.cause ? e.cause : 400).json({ message: e.message })
        }
    },
    
    postTeam: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { body } = req;
            // body["createdBy"] = user;
            // if(body.teams) {
            //     const existing = await Team.find({ 'name': { $in: body.teams}}, null, {session})
            //     const newTeams = body.teams.filter(team => !existing.map(x => x.name).includes(team)) 
            //     const docs = await Team.create(newTeams.map(x => ({ name: x, players: [], createdBy: user})), {session})
            //     body.teams = [...docs, ...existing]
            // }
            // const newTournament = new Tournament(body);
            // newTournament.save({session})
            //     .then(async tourney => {
            //         await session.commitTransaction();
            //         session.endSession()
            //         res.status(201).json(tourney)
            //     })
            //     .catch(async err => {
            //         await session.abortTransaction();
            //         session.endSession()
            //         res.status(400).json({ message: err.message })
            //     })
        } catch(e) {
            await session.abortTransaction();
            session.endSession()
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
