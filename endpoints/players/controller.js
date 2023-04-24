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

    updatePlayer: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            await Player.findOneAndUpdate({ name: body.name }, body, {
                new: true,
                upsert: true,
                runValidators: true,
                session,
            })
                .then(async (player, err) => {
                    if (err) {
                        await session.abortTransaction();
                        session.endSession();
                        errorHandler(err, res);
                    } else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({
                            result: player,
                            newData: await Player.find({
                                createdBy: user,
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
