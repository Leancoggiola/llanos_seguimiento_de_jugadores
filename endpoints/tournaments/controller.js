const { errorHandler } = require('../helpers.js');
const { Tournament, Team, User } = require('../models.js');
const mongoose = require('mongoose');

module.exports = {
    // Tournaments
    getTournaments: async (req, res) => {
        const user = req?.token;
        try {
            const tourneys = await Tournament.find({
                createdBy: user,
            }).populate({ path: 'teams', select: 'name players' });
            res.status(200).json(tourneys);
        } catch (err) {
            res.status(err?.cause ? err.cause : 400).json({
                message: err.message,
            });
        }
    },

    updateTournaments: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const { body } = req;
            body['createdBy'] = user;
            if (body.teams.length > 0) {
                const existing = await Team.find({ name: { $in: body.teams } }, null, { session });
                const newTeams = body.teams.filter(
                    (team) => !existing.map((x) => x.name).includes(team)
                );
                const docs = await Team.create(
                    newTeams.map((x) => ({
                        name: x,
                        players: [],
                        createdBy: user,
                    })),
                    { session }
                );
                body.teams = [...docs, ...existing].map((x) => x._id);
            }
            await Tournament.findOneAndUpdate({}, body, {
                new: true,
                upsert: true,
                runValidators: true,
                session,
            })
                .populate({ path: 'teams', select: 'name players' })
                .then(async (tourney, err) => {
                    if (err) {
                        await session.abortTransaction();
                        session.endSession();
                        errorHandler(err, res);
                    } else {
                        await session.commitTransaction();
                        session.endSession();
                        res.status(201).json({
                            result: tourney,
                            newData: await Tournament.find({
                                createdBy: user,
                            }).populate({
                                path: 'teams',
                                select: 'name players',
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

    deleteTournaments: async (req, res) => {
        const user = req?.token;
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const {
                body: { id },
            } = req;
            await Tournament.findByIdAndDelete(id, { session, runValidators: true })
                .then(async (response) => {
                    await session.commitTransaction();
                    session.endSession();
                    res.status(201).json({
                        result: response,
                        newData: await Tournament.find({
                            createdBy: user,
                        }).populate({ path: 'teams', select: 'name players' }),
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
};
