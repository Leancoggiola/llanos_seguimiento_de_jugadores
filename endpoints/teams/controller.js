const { Team, Tournament, Player, User } = require('../models');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers');

module.exports = {
    getTeams: async (req, res) => {
        const user = req?.token;
        try {
            const teams = await Team.find({ createdBy: user });
            res.status(200).json(teams);
        } catch (err) {
            errorHandler(err, res);
        }
    },

    postTeam: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            if (body.players.length) {
                body.players = body.players.map((player) => ({
                    name: player.name,
                    dni: player?.dni ? player.dni : null,
                    edad: player?.edad ? player.edad : 18,
                    createdBy: user,
                }));
                const newPlayers = await Player.insertMany(body.players, {
                    session,
                });
                body.players = newPlayers.map((x) => x._id);
            }
            await Team.findOneAndUpdate({}, body, {
                new: true,
                upsert: true,
                session,
            })
                .populate({ path: 'users', model: User, strictPopulate: false })
                .populate({ path: 'teams', model: Team })
                .then(async (tourney, err) => {
                    if (err) {
                        await session.abortTransaction();
                        session.endSession();
                        errorHandler(err, res);
                    } else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({
                            result: tourney,
                            newData: await Team.find({ createdBy: user }),
                        });
                    }
                })
                .catch(async (err) => {
                    await session.abortTransaction();
                    session.endSession();
                    errorHandler(err, res);
                });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            errorHandler(err, res);
        }
    },

    putTeam: async (req, res) => {
        try {
        } catch (e) {}
    },

    deleteTeam: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const {
                body: { id },
            } = req;

            const isOnTournament = await Tournament.find({
                teams: { $in: [mongoose.Types.ObjectId(id)] },
                status: { $ne: 'Terminado' },
            });

            if (isOnTournament.length > 0) {
                res.status(404).json({
                    message: 'Elimina el equipo de todo los torneos primero',
                });
            } else {
                await Team.findByIdAndDelete(id, { session })
                    .then(async (response) => {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({
                            result: response,
                            newData: await Team.find({ createdBy: user }),
                        });
                    })
                    .catch(async (err) => {
                        await session.abortTransaction();
                        session.endSession();
                        errorHandler(err, res);
                    });
            }
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            errorHandler(err, res);
        }
    },
};
