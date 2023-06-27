const mongoose = require('mongoose');

module.exports.errorHandler = async (session, err, res) => {
    if (session) {
        await session.abortTransaction();
        session.endSession();
    }
    let message = '';
    if (err instanceof mongoose.Error.ValidationError) {
        message += 'Validation Error:';
    }
    if (err instanceof ReferenceError) {
        message += 'Reference Error:';
    }
    if (err.errors) {
        Object.keys(err.errors).forEach((key) => {
            message += ` ${err.errors[key].message} -`;
        });
        res.status(400).json({ message: message.slice(0, -2) });
    } else {
        res.status(err?.cause ? err.cause : 400).json({ message: `${message} ${err.message}` });
    }
};

module.exports;
