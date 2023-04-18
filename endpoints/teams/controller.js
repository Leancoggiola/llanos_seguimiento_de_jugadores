const { Team, Tournament } = require('../models');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers')

module.exports = {
    getTeams: async (req, res) => {
        const user = req?.token;
        try {
            const teams = await Team.find({ createdBy: user})
            res.status(200).json(teams)
        } catch(err) {
            errorHandler(err, res)
        }
    },
    
    postTeam: async (req, res) => {
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
                    res.status(201).json({result: tourney, newData: await Tournament.find({ createdBy: user})})
                })
                .catch(async err => {
                    await session.abortTransaction();
                    session.endSession()
                    errorHandler(err, res)
                })
        } catch(err) {
            await session.abortTransaction();
            session.endSession()
            errorHandler(err, res)
        }
    },
    
    putTeam: async (req, res) => {
        try {
        } catch(e) {
        }
    },
    
    deleteTeam: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession()
        session.startTransaction()
        try {
            const { body: { id } } = req;

            const isOnTournament = await Tournament.find({
                "teams._id": {$in: [mongoose.Types.ObjectId(id)]}, 
                "status": {$ne: "Terminado"}
            });

            if(isOnTournament.length > 0) {
                res.status(404).json({message: "Elimina el equipo de todo los torneos primero"})
            } else {
                Team.deleteOne({id}, {session})
                .then(async response => {
                    await session.commitTransaction();
                    session.endSession()
                    res.status(201).json({result: response, newData: await Team.find({ createdBy: user})})
                })
                .catch(async err => {
                    await session.abortTransaction();
                    session.endSession()
                    errorHandler(err, res)
                })
            }
        } catch(err) {
            await session.abortTransaction();
            session.endSession()
            errorHandler(err, res)
        }
    },
}
