const { pick, isEmpty } = require('lodash');
const { errorHandler } = require('../helpers.js');
const { Tournament, Team, User, Player } = require('../models.js');
const mongoose = require('mongoose');

const tourneyOptions = [
    {
        path: 'teams',
        select: '_id name players tourney_ids',
        populate: { path: 'players', select: '_id name team_id' },
    },
    {
        path: 'groups.teams',
        select: '_id name players tourney_ids',
        populate: { path: 'players', select: '_id name age dni sanction team_id' },
    },
    {
        path: 'groups.matchs.teams',
        select: '_id name players tourney_ids',
        populate: { path: 'players', select: '_id name age dni sanction team_id' },
    },
    {
        path: 'groups.matchs.details.player',
        select: '_id name',
    },
    {
        path: 'knockout.teams',
        select: '_id name players tourney_ids',
        populate: { path: 'players', select: '_id name age dni sanction team_id' },
    },
    {
        path: 'knockout.matchs.teams',
        select: '_id name players tourney_ids',
        populate: { path: 'players', select: '_id name age dni sanction team_id' },
    },
    {
        path: 'knockout.matchs.details.player',
        select: '_id name',
    },
];

module.exports = {
    // Tournaments
    getTournaments: async (req, res) => {
        const user = req?.token;
        try {
            const tourneys = await Tournament.find({ createdBy: user })
                .populate([{ path: 'teams', select: '_id name tourney_ids' }])
                .select('name teams groups status type category')
                .lean();
            tourneys.forEach((t) => {
                t.groups = t.groups.map((g) => pick(g, ['isFinished']));
            });
            res.status(200).json(tourneys);
        } catch (err) {
            await errorHandler(null, err, res);
        }
    },

    getTournamentDetails: async (req, res) => {
        const id = req.params.id;
        try {
            let tourney = await Tournament.findById(id).populate(tourneyOptions).lean();
            tourney.groups = tourney.groups
                .map((x) => ({
                    ...x,
                    matchs: x.matchs
                        .map((match) => {
                            if (match.teams.length === 0) {
                                match.teams = [
                                    { _id: null, name: 'Desconocido', players: [], mocked: true },
                                    { _id: null, name: 'Desconocido', players: [], mocked: true },
                                ];
                            }
                            return match;
                        })
                        .sort((a, b) => a.matchOrder - b.matchOrder)
                        .sort((a, b) => a.week - b.week),
                }))
                .sort((a, b) => a.name.localeCompare(b.name));
            tourney.knockout = tourney.knockout
                .map((x) => ({
                    ...x,
                    matchs: x.matchs
                        .map((match) => {
                            if (match.teams.length === 0) {
                                match.teams = [
                                    { _id: null, name: 'Desconocido', players: [], mocked: true },
                                    { _id: null, name: 'Desconocido', players: [], mocked: true },
                                ];
                            }
                            if (match.teams.length === 1 && match.teams.some((x) => x._id.toString() === '65012bf767e463f4f47fe668')) {
                                match.teams.unshift({ _id: null, name: 'Desconocido', players: [], mocked: true });
                            }
                            return match;
                        })
                        .sort((a, b) => a.matchOrder - b.matchOrder)
                        .sort((a, b) => a.week - b.week),
                }))
                .sort((a, b) => a.order - b.order);
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
            body['createdOn'] = new Date();

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
                            newData: await Tournament.find({ createdBy: user }).populate({
                                path: 'teams',
                                select: '_id name tourney_ids',
                            }),
                            newTeams: await Team.find({ createdBy: user, hidden: false }).populate({
                                path: 'players',
                                select: '_id name team_id',
                            }),
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
                            newData: await Tournament.find({ createdBy: user }).populate({
                                path: 'teams',
                                select: '_id name tourney_ids',
                            }),
                            newTeams: await Team.find({ createdBy: user, hidden: false }).populate({
                                path: 'players',
                                select: '_id name team_id',
                            }),
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
        session.startTransaction({
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' },
        });
        try {
            const { body } = req;
            const id = req.params.id;
            const tourney = await Tournament.findOne({ _id: id }).session(session);
            const formatedData = await Tournament.findOne({ _id: id }).populate('groups.matchs').lean().session(session);

            if (!isEmpty(body?.configs)) {
                await saveConfig(body.configs.group, user, session, res);
                tourney.configs = body.configs;
            }
            if (body?.teams) {
                await updateTeams(body.teams, id, session);
                tourney.teams = body.teams;
            }
            if (body?.groups) tourney.groups = body.groups;
            if (body?.knockout) tourney.knockout = body.knockout;
            tourney.status = body.status;

            await updatePlayersSanctions(body?.groups ? body.groups : formatedData.groups, body?.knockout ? body.knockout : formatedData.knockout, session);

            tourney
                .save()
                .then(async () => {
                    await session.commitTransaction();
                    session.endSession();
                    res.status(200).json('Información cargada con exito');
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
                        newTeams: await Team.find({ createdBy: user, hidden: false }).populate({
                            path: 'players',
                            select: '_id name team_id',
                        }),
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

const updatePlayersSanctions = async (groups = [], knockout = [], session) => {
    const matches = [...groups, ...knockout].flatMap((x) => x.matchs).filter((x) => !x.teams.includes(null));
    const matchsWithDate = matches.filter((x) => x?.date);
    if (matchsWithDate.length) {
        const teamsToCheck = matchsWithDate.flatMap((x) => x.teams.map((x) => (x?._id ? x._id : x)));
        const playersToUpdate = await Player.find({ team_id: { $in: teamsToCheck }, initial_sanction: { $gt: 0 } }, null, { session }).lean();
        playersToUpdate.forEach((x) => {
            x.team_id = x.team_id.toString();
        });
        matchsWithDate.forEach((x) => {
            x.teams = x.teams.map((i) => i.toString());
        });
        await Promise.all(
            playersToUpdate.map(async (player) => {
                const newSanction = matchsWithDate.reduce((prev, match) => {
                    if (prev !== 0 && match.teams.includes(player.team_id)) {
                        prev = new Date(match.date) > new Date(player.sanction_date) ? prev - 1 : prev;
                    }
                    return prev;
                }, player.initial_sanction);
                const updateData = {
                    sanction: newSanction,
                    initial_sanction: newSanction < 1 ? 0 : player.initial_sanction,
                    sanction_date: newSanction < 1 ? null : player.sanction_date,
                };
                await Player.findOneAndUpdate({ _id: player._id }, updateData, {
                    session,
                });
            })
        );
    }
};

const updateTeams = async (teams = [], tourneyId, session) => {
    await Team.bulkWrite(
        [
            {
                updateMany: {
                    filter: { _id: { $in: teams } },
                    update: { $addToSet: { tourney_ids: tourneyId } },
                },
            },
            {
                updateMany: {
                    filter: { _id: { $nin: teams }, tourney_ids: { $in: tourneyId } },
                    update: { $pull: { tourney_ids: tourneyId } },
                },
            },
        ],
        null,
        { session }
    )
        .then(async (_, err) => {
            if (err) await errorHandler(session, err, res);
        })
        .catch(async (err) => await errorHandler(session, err, res));
};
