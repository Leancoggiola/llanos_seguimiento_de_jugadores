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
                const tournaments = await Tournament.find()
                    .populate({
                        path: 'groups',
                        select: '_id matchs',
                        populate: [
                            {
                                path: 'matchs',
                                select: '_id details',
                                populate: [
                                    {
                                        path: 'details',
                                        select: '_id',
                                    },
                                ],
                            },
                        ],
                    })
                    .lean();

                const groups = tournaments.flatMap((x) => x.groups);
                const matchs = groups.flatMap((x) => x.matchs);
                const details = matchs.flatMap((x) => x.details);

                const records = { groups: 0, matchs: 0, details: 0 };
                let result;

                // Grupos
                result = await Group.deleteMany({ _id: { $nin: groups.map((x) => x._id) } }, { session });
                if (result.acknowledged) {
                    records.groups = result.deletedCount;
                } else throw new Error('Hubo un error al eliminar registros en Groups');

                // Matchs
                result = await Match.deleteMany({ _id: { $nin: matchs.map((x) => x._id) } }, { session });
                if (result.acknowledged) {
                    records.matchs = result.deletedCount;
                } else throw new Error('Hubo un error al eliminar registros en Matchs');

                // Details
                result = await MatchDetails.deleteMany({ _id: { $nin: details.map((x) => x._id) } }, { session });
                if (result.acknowledged) {
                    records.details = result.deletedCount;
                } else throw new Error('Hubo un error al eliminar registros en Details');

                await Logs.updateOne(
                    { _id: new mongoose.Types.ObjectId() },
                    {
                        message: 'Registros eliminados',
                        recordsDeleted: records.groups + records.matchs + records.details,
                        isSuccessful: true,
                        date: new Date(),
                    },
                    { upsert: true }
                )
                    .then(async (_, err) => {
                        if (err) {
                            throw new Error(err);
                        } else {
                            console.log('Registros eliminados');
                            await session.commitTransaction();
                        }
                    })
                    .catch(async (err) => {
                        throw new Error(err);
                    });
                session.endSession();
            } catch (err) {
                await session.abortTransaction();
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
