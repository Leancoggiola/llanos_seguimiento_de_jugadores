const mongoose = require('mongoose')

module.exports.errorHandler = (err, res) => {
    let message = '';
    if(err instanceof mongoose.Error.ValidationError) {
        message += 'Validation Error:';
    }
    if(err.errors) {
        Object.keys(err.errors).forEach(key => {
            message += ` ${err.errors[key].message} -`
        })
        res.status(400).json({message: message.slice(0, -2)})
    } else {
        res.status(e?.cause ? e.cause : 400).json({ message: e.message })
    }
}

module.exports