const { Team, Tournament, Player } = require('../models');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers');

module.exports = {
    getTeams: async (req, res) => {
        const user = req?.token;
        try {
            const teams = await Team.find({ createdBy: user, hidden: false }).select('_id name players tourney_ids mocked').populate({
                path: 'players',
                select: '_id name age dni initial_sanction sanction sanction_date team_id',
            });
            res.status(200).json(teams);
        } catch (err) {
            await errorHandler(null, err, res);
        }
    },

    addTeam: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            const newTeamId = new mongoose.Types.ObjectId();
            body['createdBy'] = user;
            body['_id'] = newTeamId;

            if (body.players.length) {
                const existing = body.players.filter((x) => x._id).map((x) => x._id);
                const newPlayers = body.players
                    .filter((x) => !x._id)
                    .map((player) => {
                        return {
                            _id: new mongoose.Types.ObjectId(),
                            name: player.name,
                            dni: player?.dni ? player.dni : null,
                            age: player?.age ? player.age : 18,
                            team_id: newTeamId,
                            createdBy: user,
                        };
                    });

                // Añadir jugadores nuevos a la DB
                let docs;
                await Player.insertMany(newPlayers, { session }).then(async (doc) => (docs = doc.map((x) => x._id)));

                // Actualizar el team id de los jugadores existentes
                await Player.updateMany({ _id: { $in: existing } }, { $set: { team_id: newTeamId } }, { session });

                body.players = [...existing, ...docs];
            }
            const doc = new Team({ ...body, name: null });
            const response = await doc.save({ session });

            await session.commitTransaction();
            session.endSession();
            res.status(201).json({
                result: response,
                newData: await Team.find({ createdBy: user, hidden: false })
                    .select('_id name players tourney_ids mocked')
                    .populate({ path: 'players', select: '_id name team_id' }),
                newPlayers: await Player.find({ createdBy: user, hidden: false }),
            });
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },

    updateTeam: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            const id = req.params.id;
            if (body.players.length) {
                const existing = body.players.filter((x) => x._id).map((x) => x._id);
                const newPlayers = body.players
                    .filter((x) => !x._id)
                    .map((player) => {
                        return {
                            name: player.name,
                            dni: player?.dni ? player.dni : null,
                            age: player?.age ? player.age : 18,
                            team_id: id,
                            createdBy: user,
                        };
                    });

                // Añadir jugadores nuevos a la DB
                let docs;
                await Player.insertMany(newPlayers, { session }).then(async (doc) => (docs = doc.map((x) => x._id)));

                // Actualizar el team id de los jugadores existentes
                await Player.updateMany({ _id: { $in: existing } }, { $set: { team_id: id } }, { session });

                body.players = [...existing, ...docs];
            }

            //Remove team id de los players
            await Player.updateMany({ team_id: id, _id: { $nin: body.players } }, { $set: { team_id: null } }, { session });

            const response = await Team.findOneAndUpdate({ _id: id }, body, {
                new: true,
                upsert: false,
                runValidators: true,
                session,
            });

            await session.commitTransaction();
            session.endSession();
            res.status(200).json({
                result: response,
                newData: await Team.find({ createdBy: user, hidden: false })
                    .select('_id name players tourney_ids mocked')
                    .populate({ path: 'players', select: '_id name team_id' }),
                newPlayers: await Player.find({ createdBy: user, hidden: false }),
            });
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },

    deleteTeam: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const id = req.params.id;

            const isOnTournament = await Tournament.find({
                teams: { $in: [new mongoose.Types.ObjectId(id)] },
                status: { $ne: 'Terminado' },
            });

            if (isOnTournament.length > 0) {
                res.status(404).json({
                    message: 'El equipo se encuentra en un torneo activo.',
                });
            } else {
                //Remove team id de los players
                await Player.updateMany({ team_id: id }, { $set: { team_id: null } }, { session });

                const response = await Team.findByIdAndUpdate(id, { $set: { hidden: true } }, { session, runValidators: true });
                await session.commitTransaction();
                session.endSession();
                res.status(200).json({
                    result: response,
                    newData: await Team.find({ createdBy: user, hidden: false })
                        .select('_id name players tourney_ids mocked')
                        .populate({ path: 'players', select: '_id name team_id' }),
                    newPlayers: await Player.find({ createdBy: user, hidden: false }),
                });
            }
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },
};
