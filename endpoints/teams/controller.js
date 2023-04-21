const { Team, Tournament, Player, User } = require('../models');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers');

module.exports = {
    getTeams: async (req, res) => {
        const user = req?.token;
        try {
            const teams = await Team.find({ createdBy: user }).populate({
                path: 'players',
                select: 'name dni age',
            });
            res.status(200).json(teams);
        } catch (err) {
            errorHandler(err, res);
        }
    },

    updateTeam: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            if (body.players.length) {
                body.players = body.players.map((player) => {
                    const newObj = {};
                    newObj.name = player.name;
                    newObj.age = player?.age ? player.age : 18;
                    newObj.createdBy = user;
                    if (player?.dni) newObj.dni = player.dni;
                    return newObj;
                });
                const existing = await Player.find(
                    {
                        $or: [
                            { dni: { $in: body.players.filter((x) => x.dni).map((x) => x.dni) } },
                            {
                                $and: [
                                    { name: { $in: body.players.map((x) => x.name) } },
                                    { dni: null },
                                ],
                            },
                        ],
                    },
                    null,
                    { session }
                );
                const newPlayers = body.players.filter(
                    (player) =>
                        !existing.some(
                            (x) => (x.dni && x.dni === player.dni) || x.name === player.name
                        )
                );
                const docs = await Player.create(newPlayers, { session });
                body.players = [...docs, ...existing].map((x) => x._id);
            }
            await Team.findOneAndUpdate({ name: body.name }, body, {
                new: true,
                upsert: true,
                runValidators: true,
                session,
            })
                .populate({ path: 'players', select: 'name dni age' })
                .then(async (team, err) => {
                    if (err) {
                        await session.abortTransaction();
                        session.endSession();
                        errorHandler(err, res);
                    } else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({
                            result: team,
                            newData: await Team.find({
                                createdBy: user,
                            }).populate({
                                path: 'players',
                                select: 'name dni age',
                            }),
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

    deleteTeam: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const {
                body: { id },
            } = req;

            const isOnTournament = await Tournament.find({
                teams: { $in: [new mongoose.Types.ObjectId(id)] },
                status: { $ne: 'Terminado' },
            });

            if (isOnTournament.length > 0) {
                res.status(404).json({
                    message: 'Elimina el equipo de todo los torneos primero',
                });
            } else {
                await Team.findByIdAndDelete(id, { session, runValidators: true })
                    .then(async (response) => {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({
                            result: response,
                            newData: await Team.find({ createdBy: user }).populate({
                                path: 'players',
                                select: 'name dni age',
                            }),
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
