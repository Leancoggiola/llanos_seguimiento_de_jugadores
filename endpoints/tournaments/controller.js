const { pick, omit } = require('lodash');
const { errorHandler } = require('../helpers.js');
const { Tournament, Team, User, Group, Match, MatchDetails } = require('../models.js');
const mongoose = require('mongoose');

module.exports = {
    // Tournaments
    getTournaments: async (req, res) => {
        const user = req?.token;
        try {
            const tourneys = await Tournament.find({ createdBy: user }).populate({ path: 'teams', select: '_id name tourney_ids' });
            res.status(200).json(tourneys);
        } catch (err) {
            await errorHandler(null, err, res);
        }
    },

    getTournamentDetails: async (req, res) => {
        const id = req.params.id;
        try {
            const tourney = await Tournament.findById(id).populate([
                { path: 'teams', select: '_id name players tourney_ids', populate: { path: 'players', select: '_id name age dni sanction team_id' } },
                {
                    path: 'groups',
                    populate: [
                        {
                            path: 'matchs',
                            populate: [
                                {
                                    path: 'details',
                                    populate: { path: 'player', select: '_id name age dni sanction team_id' },
                                },
                                {
                                    path: 'teams',
                                    select: '_id name players tourney_ids',
                                    populate: { path: 'players', select: '_id name age dni sanction team_id' },
                                },
                            ],
                        },
                        {
                            path: 'teams',
                            select: '_id name players tourney_ids',
                            populate: { path: 'players', select: '_id name age dni sanction team_id' },
                        },
                    ],
                },
            ]);
            res.status(200).json(tourney);
        } catch (err) {
            await errorHandler(null, err, res);
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
                            newData: await Tournament.find({ createdBy: user }).populate({ path: 'teams', select: '_id name tourney_ids' }),
                            newTeams: await Team.find({ createdBy: user }).populate({ path: 'players', select: '_id name age dni sanction team_id' }),
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
                let docs = [];
                if (newTeams.length) {
                    await Team.insertMany(newTeams, { session })
                        .then(async (doc, err) => {
                            if (err) await errorHandler(session, err, res);
                            else docs = doc.map((x) => x._id);
                        })
                        .catch(async (err) => await errorHandler(session, err, res));
                }

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
                            newData: await Tournament.find({ createdBy: user }).populate({ path: 'teams', select: '_id name tourney_ids' }),
                            newTeams: await Team.find({ createdBy: user }).populate({ path: 'players', select: '_id name age dni sanction team_id' }),
                        });
                    }
                })
                .catch(async (err) => await errorHandler(session, err, res));
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },

    updateTournamentDetails: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            const id = req.params.id;

            await saveConfig(body.configs.group, user, session, res);
            body.groups = await saveGroups(body.groups, session);

            await Team.updateMany({ _id: { $in: body.teams.map((x) => x._id) } }, { $addToSet: { tourney_ids: body._id } }, { session });

            await Tournament.findOneAndUpdate({ _id: id }, body, { session })
                .then(async (tourney) => {
                    await session.commitTransaction();
                    session.endSession();
                    res.status(200).json({
                        result: tourney,
                    });
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
                        newData: await Tournament.find({ createdBy: user }),
                        newTeams: await Team.find({ createdBy: user }).populate({ path: 'players', select: '_id name age dni sanction team_id' }),
                    });
                })
                .catch(async (err) => await errorHandler(session, err, res));
        } catch (err) {
            await errorHandler(session, err, res);
        }
    },
};

const saveConfig = async (config, user, session, res) => {
    await User.findOneAndUpdate({ _id: user }, { groupConfig: config }, { session })
        .then(async (_, err) => {
            if (err) await errorHandler(session, err, res);
        })
        .catch(async (err) => await errorHandler(session, err, res));
};

const saveGroups = async (groups, session) => {
    const ids = [];
    await Promise.all(
        groups.map(async (group) => {
            let doc;
            group.teams = group.teams.map((x) => x._id);
            // Save Matchs if are
            if (group.matchs) group.matchs = await saveMatchs(group.matchs, session);

            doc = await Group.findOneAndUpdate({ _id: group._id ?? new mongoose.Types.ObjectId() }, group, { session, new: true, upsert: true });
            ids.push(doc._id);
        })
    );
    return ids;
};

const saveMatchs = async (matchs, session) => {
    const ids = [];
    await Promise.all(
        matchs.map(async (match) => {
            let doc;
            match.teams = match.teams.map((x) => x._id);
            // Save details if are
            if (match.details) match.details = await saveMatchDetails(match.details, session);

            doc = await Match.findOneAndUpdate({ _id: match._id ?? new mongoose.Types.ObjectId() }, match, { session, new: true, upsert: true });
            ids.push(doc._id);
        })
    );
    return ids;
};

const saveMatchDetails = async (details, session) => {
    const ids = [];
    await Promise.all(
        details.map(async (detail) => {
            let doc;
            detail.player = detail.player?._id ?? null;
            doc = await MatchDetails.findOneAndUpdate({ _id: detail._id ?? new mongoose.Types.ObjectId() }, detail, { session, new: true, upsert: true });
            ids.push(doc._id);
        })
    );
    return ids;
};
