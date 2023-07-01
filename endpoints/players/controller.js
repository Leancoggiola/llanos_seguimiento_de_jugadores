const { Player, Tournament } = require('../models');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers');

module.exports = {
    getPlayers: async (req, res) => {
        const user = req?.token;
        try {
            const players = await Player.find({ createdBy: user }).select('_id name age dni team_id');
            res.status(200).json(players);
        } catch (err) {
            await errorHandler(null, err, res);
        }
    },

    addPlayer: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            const doc = new Player({ ...body });
            await doc
                .save({ session })
                .then(async (player, err) => {
                    if (err) await errorHandler(session, err, res);
                    else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({ result: player, newData: await Player.find({ createdBy: user }).select('_id name age dni team_id') });
                    }
                })
                .catch(async (err) => await errorHandler(session, err, res));
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },

    updatePlayer: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            await Player.findOneAndUpdate({ _id: req.params.id }, body, {
                new: true,
                select: '_id name age dni team_id',
                upsert: false,
                runValidators: true,
                session,
            })
                .then(async (player, err) => {
                    if (err) await errorHandler(session, err, res);
                    else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({ result: player, newData: await Player.find({ createdBy: user }).select('_id name age dni team_id') });
                    }
                })
                .catch(async (err) => await errorHandler(session, err, res));
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },

    deletePlayer: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const id = req.params.id;
            const player = await Player.findById(req.params.id);

            const deletePlayer = async () => {
                await Player.findByIdAndDelete(id, { session })
                    .then(async (response) => {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({ result: response, newData: await Player.find({ createdBy: user }).select('_id name age dni team_id') });
                    })
                    .catch(async (err) => await errorHandler(session, err, res));
            };

            if (!player.team_id) {
                await deletePlayer();
            } else {
                const isOnTournament = await Tournament.find({ status: { $ne: 'Terminado' }, teams: { $nin: [player.team_id] } });
                if (isOnTournament?.length) res.status(404).json({ message: 'El jugador se encuentra en un torneo activo.' });
                else await deletePlayer();
            }
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },
};
