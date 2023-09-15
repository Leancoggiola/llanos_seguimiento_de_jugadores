const { Player, Tournament, Team } = require('../models');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers');

module.exports = {
    getPlayers: async (req, res) => {
        const user = req?.token;
        try {
            const players = await Player.find({ createdBy: user, hidden: false }).select('_id name age dni initial_sanction sanction sanction_date team_id sanction_history');
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
            const response = await doc.save({ session });
            await session.commitTransaction();
            session.endSession();
            res.status(201).json({
                result: response,
                newData: await Player.find({ createdBy: user, hidden: false }).select('_id name age dni initial_sanction sanction sanction_date team_id sanction_history'),
            });
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
            body.dni = body.dni ? body.dni : null;
            if (body.update_date) {
                body.initial_sanction = body.sanction;
                body.sanction_date = new Date(body.sanction_date);
            }

            const player = await Player.findOneAndUpdate({ _id: req.params.id }, body, {
                new: true,
                select: '_id name age dni initial_sanction sanction sanction_date team_id',
                upsert: false,
                runValidators: true,
                session,
            });
            await session.commitTransaction();
            session.endSession();
            res.status(201).json({
                result: player,
                newData: await Player.find({ createdBy: user, hidden: false }).select('_id name age dni initial_sanction sanction sanction_date team_id sanction_history'),
            });
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
                if (player.team_id) {
                    await Team.findOneAndUpdate({ _id: player.team_id }, { $pull: { players: { _id: id } } }, { session });
                }
                const response = await Player.findByIdAndUpdate(id, { $set: { hidden: true } }, { session });
                await session.commitTransaction();
                session.endSession();
                res.status(201).json({
                    result: response,
                    newData: await Player.find({ createdBy: user, hidden: false }).select('_id name age dni initial_sanction sanction sanction_date team_id sanction_history'),
                });
            };

            const isOnTournament = await Tournament.find({ status: { $ne: 'Terminado' }, teams: { $in: [player?.team_id] } });
            if (isOnTournament?.length) {
                throw new Error('El jugador se encuentra en un torneo activo.');
            } else {
                await deletePlayer();
            }
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },
};
