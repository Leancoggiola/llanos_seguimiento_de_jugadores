const { Player, Tournament } = require('../models');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers');

module.exports = {
    getPlayers: async (req, res) => {
        const user = req?.token;
        try {
            const players = await Player.find({ createdBy: user });
            res.status(200).json(players);
        } catch (err) {
            errorHandler(err, res);
        }
    },

    postPlayer: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            if (body.players) {
                const existing = await Player.find({ name: { $in: body.players } }, null, {
                    session,
                });
                const newPlayers = body.players.filter(
                    (player) => !existing.map((x) => x.name).includes(player)
                );
                const docs = await Player.create(
                    newPlayers.map((x) => ({ name: x, players: [], createdBy: user })),
                    { session }
                );
                body.players = [...docs, ...existing];
            }
            const newTournament = new Tournament(body);
            newTournament
                .save({ session })
                .then(async (tourney) => {
                    await session.commitTransaction();
                    session.endSession();
                    res.status(201).json({
                        result: tourney,
                        newData: await Tournament.find({ createdBy: user }),
                    });
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

    putPlayer: async (req, res) => {
        try {
        } catch (e) {}
    },

    deletePlayer: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const {
                body: { id },
            } = req;

            const isOnTournament = await Tournament.find({
                'players._id': { $in: [mongoose.Types.ObjectId(id)] },
                status: { $ne: 'Terminado' },
            });

            if (isOnTournament.length > 0) {
                res.status(404).json({ message: 'Elimina el equipo de todo los torneos primero' });
            } else {
                await Player.findByIdAndDelete(id, { session })
                    .then(async (response) => {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({
                            result: response,
                            newData: await Player.find({ createdBy: user }),
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
