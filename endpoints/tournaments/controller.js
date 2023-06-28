const { errorHandler } = require('../helpers.js');
const { Tournament, Team } = require('../models.js');
const mongoose = require('mongoose');

module.exports = {
    // Tournaments
    getTournaments: async (req, res) => {
        const user = req?.token;
        try {
            const tourneys = await Tournament.find({ createdBy: user }).populate({ path: 'teams', select: '_id name players' });
            res.status(200).json(tourneys);
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },

    addTournament: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            const newTeamId = new mongoose.Types.ObjectId();
            body['createdBy'] = user;
            body['_id'] = newTeamId;

            if (body.teams.length > 0) {
                const existing = body.teams.filter((x) => x._id).map((x) => x._id);
                const newTeams = body.teams
                    .filter((x) => !x._id)
                    .map((team) => {
                        return {
                            _id: new mongoose.Types.ObjectId(),
                            name: team.name,
                            players: [],
                            createdBy: user,
                            tourney_ids: [newTeamId],
                        };
                    });

                // Añadir teams nuevos a la DB
                let docs;
                await Team.insertMany(newTeams, { session })
                    .then(async (doc, err) => {
                        if (err) await errorHandler(session, err, res);
                        else docs = doc.map((x) => x._id);
                    })
                    .catch(async (err) => await errorHandler(session, err, res));

                // Actualizar el team id de los jugadores existentes
                await Team.updateMany({ _id: { $in: existing } }, { $addToSet: { tourney_ids: newTeamId } }, { session })
                    .then(async (_, err) => {
                        if (err) await errorHandler(session, err, res);
                    })
                    .catch(async (err) => await errorHandler(session, err, res));

                body.teams = [...existing, ...docs];
            }

            const doc = new Tournament({ ...body });
            await doc
                .save({ session })
                .then(async (tourney, err) => {
                    if (err) await errorHandler(session, err, res);
                    else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({
                            result: tourney,
                            newData: await Tournament.find({ createdBy: user }).populate({ path: 'teams', select: 'name players' }),
                            newTeams: await Team.find({ createdBy: user }).populate({ path: 'players', select: '_id name dni age' }),
                        });
                    }
                })
                .catch(async (err) => await errorHandler(session, err, res));
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },

    updateTournaments: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            const id = req.params.id;

            if (body.teams.length > 0) {
                const existing = body.teams.filter((x) => x._id).map((x) => x._id);
                const newTeams = body.teams
                    .filter((x) => !x._id)
                    .map((team) => {
                        return {
                            _id: new mongoose.Types.ObjectId(),
                            name: team.name,
                            players: [],
                            createdBy: user,
                            tourney_ids: [id],
                        };
                    });

                // Añadir teams nuevos a la DB
                let docs;
                await Team.insertMany(newTeams, { session })
                    .then(async (doc, err) => {
                        if (err) await errorHandler(session, err, res);
                        else docs = doc.map((x) => x._id);
                    })
                    .catch(async (err) => await errorHandler(session, err, res));

                // Actualizar el team id de los jugadores existentes
                await Team.updateMany({ _id: { $in: existing } }, { $addToSet: { tourney_ids: id } }, { session })
                    .then(async (_, err) => {
                        if (err) await errorHandler(session, err, res);
                    })
                    .catch(async (err) => await errorHandler(session, err, res));

                body.teams = [...existing, ...docs];
            }

            await Tournament.findById(id)
                .then(async (tourney, err) => {
                    if (err) await errorHandler(session, err, res);
                    else {
                        // Remove tourney id from team
                        const newData = tourney.teams.filter((x) => !body.teams.includes(x.toString()));
                        await Team.updateMany({ _id: { $in: newData } }, { $pull: { tourney_ids: id } }, { session })
                            .then(async (_, err) => {
                                if (err) await errorHandler(session, err, res);
                            })
                            .catch(async (err) => await errorHandler(session, err, res));
                    }
                })
                .catch(async (err) => await errorHandler(session, err, res));

            await Tournament.findOneAndUpdate({ _id: id }, body, {
                new: true,
                upsert: false,
                runValidators: true,
                session,
            })
                .then(async (tourney, err) => {
                    if (err) await errorHandler(session, err, res);
                    else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(200).json({
                            result: tourney,
                            newData: await Tournament.find({ createdBy: user }).populate({ path: 'teams', select: 'name players' }),
                            newTeams: await Team.find({ createdBy: user }).populate({ path: 'players', select: '_id name dni age' }),
                        });
                    }
                })
                .catch(async (err) => await errorHandler(session, err, res));
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },

    deleteTournaments: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const id = req.params.id;

            // Remove tournament from teams
            await Team.updateMany({ $in: { tourney_ids: id } }, { $pull: { tourney_ids: id } }, { session })
                .then(async (_, err) => {
                    if (err) await errorHandler(session, err, res);
                })
                .catch(async (err) => await errorHandler(session, err, res));

            await Tournament.findByIdAndDelete(id, { session, runValidators: true })
                .then(async (tourney) => {
                    await session.commitTransaction();
                    session.endSession();
                    res.status(200).json({
                        result: tourney,
                        newData: await Tournament.find({ createdBy: user }).populate({ path: 'teams', select: 'name players' }),
                        newTeams: await Team.find({ createdBy: user }).populate({ path: 'players', select: '_id name dni age' }),
                    });
                })
                .catch(async (err) => await errorHandler(session, err, res));
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },
};
