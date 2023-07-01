const scheduler = require('node-cron');
const { Tournament, Group, Match, MatchDetails, Logs } = require('./endpoints/models');
const { default: mongoose } = require('mongoose');

module.exports = {
    clearUnsetDocuments: () => {
        // 0 0 4 * * *
        //*/10 * * * * *
        scheduler.schedule('0 0 4 * * *', async () => {
            const session = await mongoose.startSession();
            session.startTransaction();
            try {
                const tournaments = await Tournament.find();
                const groups = await Group.find();
                const matchs = await Match.find();

                // Grupos sin torneo a eliminar
                const assignedGroups = tournaments.flatMap((x) => x.groups).filter((x) => x._id);
                const groupsNA = await Group.find({ _id: { $nin: assignedGroups } });
                await Group.deleteMany({ _id: { $in: groupsNA.map((x) => x._id) } }, { session });

                // Matchs sin grupo
                const matchsInGroups = groups.flatMap((x) => x.matchs).map((x) => x._id);
                const matchsNA = await Match.find({ _id: { $nin: matchsInGroups } });
                await Match.deleteMany({ _id: { $in: matchsNA.map((x) => x._id) } }, { session });
                // Details en matchs de grupos sin torneo
                const detailsInMatch = matchs.flatMap((x) => x.details).map((x) => x._id);
                const detailsNA = await MatchDetails.find({ _id: { $nin: detailsInMatch } });
                await MatchDetails.deleteMany({ _id: { $in: detailsNA.map((x) => x._id) } }, { session });

                await session.commitTransaction();
                await Logs.updateOne(
                    { _id: new mongoose.Types.ObjectId() },
                    {
                        message: 'Registros eliminados',
                        recordsDeleted: groupsNA.length + matchsNA.length + detailsNA.length,
                        isSuccessful: true,
                    },
                    { upsert: true }
                )
                    .then(async (_, err) => {
                        if (err) await session.abortTransaction();
                        else {
                            console.log('Registros eliminados');
                            await session.commitTransaction();
                        }
                    })
                    .catch(async (err) => session.abortTransaction());
                session.endSession();
            } catch (err) {
                await session.abortTransaction();
                console.error(err);
                await Logs.updateOne(
                    { _id: new mongoose.Types.ObjectId() },
                    {
                        message: err,
                        recordsDeleted: 0,
                        isSuccessful: false,
                    },
                    { upsert: true }
                )
                    .then(async (_, err) => {
                        if (err) await session.abortTransaction();
                        else await session.commitTransaction();
                    })
                    .catch(async () => session.abortTransaction());
                session.endSession();
            }
        });
    },
};
