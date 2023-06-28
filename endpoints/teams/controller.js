const { Team, Tournament, Player } = require('../models');
const mongoose = require('mongoose');
const { errorHandler } = require('../helpers');

module.exports = {
    getTeams: async (req, res) => {
        const user = req?.token;
        try {
            const teams = await Team.find({ createdBy: user }).populate({
                path: 'players',
                select: '_id name dni age',
            });
            res.status(200).json(teams);
        } catch (err) {
            await errorHandler(session, err, res);
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
                await Player.insertMany(newPlayers, { session })
                    .then(async (doc, err) => {
                        if (err) await errorHandler(session, err, res);
                        else docs = doc.map((x) => x._id);
                    })
                    .catch(async (err) => await errorHandler(session, err, res));

                // Actualizar el team id de los jugadores existentes
                await Player.updateMany({ _id: { $in: existing } }, { $set: { team_id: newTeamId } }, { session })
                    .then(async (_, err) => {
                        if (err) await errorHandler(session, err, res);
                    })
                    .catch(async (err) => await errorHandler(session, err, res));

                body.players = [...existing, ...docs];
            }
            const doc = new Team({ ...body });
            await doc
                .save({ session })
                .then(async (team, err) => {
                    if (err) await errorHandler(session, err, res);
                    else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({
                            result: team,
                            newData: await Team.find({ createdBy: user }).populate({ path: 'players', select: '_id name dni age' }),
                            newPlayers: await Player.find({ createdBy: user }),
                        });
                    }
                })
                .catch(async (err) => await errorHandler(session, err, res));
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
                await Player.insertMany(newPlayers, { session })
                    .then(async (doc, err) => {
                        if (err) await errorHandler(session, err, res);
                        else docs = doc.map((x) => x._id);
                    })
                    .catch(async (err) => await errorHandler(session, err, res));

                // Actualizar el team id de los jugadores existentes
                await Player.updateMany({ _id: { $in: existing } }, { $set: { team_id: id } }, { session })
                    .then(async (_, err) => {
                        if (err) await errorHandler(session, err, res);
                    })
                    .catch(async (err) => await errorHandler(session, err, res));

                body.players = [...existing, ...docs];
            }

            //Remove team id de los players
            await Player.updateMany({ team_id: id, _id: { $nin: body.players } }, { $set: { team_id: null } }, { session })
                .then(async (_, err) => {
                    if (err) await errorHandler(session, err, res);
                })
                .catch(async (err) => await errorHandler(session, err, res));

            await Team.findOneAndUpdate({ _id: id }, body, {
                new: true,
                upsert: false,
                runValidators: true,
                session,
            })
                .then(async (team, err) => {
                    if (err) await errorHandler(session, err, res);
                    else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(200).json({
                            result: team,
                            newData: await Team.find({ createdBy: user }).populate({ path: 'players', select: '_id name dni age' }),
                            newPlayers: await Player.find({ createdBy: user }),
                        });
                    }
                })
                .catch(async (err) => await errorHandler(session, err, res));
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
                await Player.updateMany({ team_id: id }, { $set: { team_id: null } }, { session })
                    .then(async (_, err) => {
                        if (err) await errorHandler(session, err, res);
                    })
                    .catch(async (err) => await errorHandler(session, err, res));

                await Team.findByIdAndDelete(id, { session, runValidators: true })
                    .then(async (response) => {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(200).json({
                            result: response,
                            newData: await Team.find({ createdBy: user }).populate({ path: 'players', select: '_id name dni age' }),
                            newPlayers: await Player.find({ createdBy: user }),
                        });
                    })
                    .catch(async (err) => await errorHandler(session, err, res));
            }
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },
};
