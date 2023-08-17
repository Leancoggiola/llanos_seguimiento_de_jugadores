const { User, Team, Tournament, Player } = require('../models.js');
const { errorHandler } = require('../helpers.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    // Status
    isLogged: async (req, res) => {
        try {
            const user = await User.findById(req?.token).catch((err) => res.status(400).json({ message: err.message }));
            if (user) res.status(200).json('Logged');
            else res.sendStatus(403);
        } catch (err) {
            await errorHandler(null, err, res);
        }
    },

    login: async (req, res) => {
        const { username, password } = req.body;
        try {
            const user = await User.findOne({ username });
            const dehash = atob(password);

            if (user) {
                const auth = await bcrypt.compare(dehash.replace(process.env.HASH_PASSWORD, ''), user.password);
                if (auth) {
                    const jwtToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: 1 * 24 * 60 * 60 });
                    res.cookie('jwt', jwtToken, {
                        withCredentials: true,
                        httpOnly: false,
                        maxAge: 1 * 24 * 60 * 60 * 1000,
                    });
                    res.status(200).json({
                        groupConfig: user.groupConfig,
                        knockoutConfig: user.knockoutConfig,
                    });
                } else {
                    await errorHandler(null, { message: 'Contraseña Incorrecta' }, res);
                }
            } else {
                await errorHandler(null, { message: 'Usuario Incorrecto' }, res);
            }
        } catch (err) {
            await errorHandler(null, err, res);
        }
    },

    postUser: async (req, res) => {
        const { username, password, secret } = req.body;
        try {
            if (secret !== process.env.REGISTER_SECRET) {
                res.status(401).json({ message: 'No puedes registrarte en esta app' });
            } else {
                const salt = await bcrypt.genSalt();
                const hash = await bcrypt.hash(password, salt);

                const user = await User.create({ username, password: hash }).catch((err) => res.status(400).json({ message: err.message }));
                const jwtToken = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: 1 * 24 * 60 * 60 });
                res.cookie('jwt', jwtToken, {
                    withCredentials: true,
                    httpOnly: false,
                    maxAge: 1 * 24 * 60 * 60 * 1000,
                });
                res.status(201).json({ message: 'Registrado con exito' });
            }
        } catch (err) {
            await errorHandler(null, err, res);
        }
    },

    deleteUser: async (req, res) => {
        const { username } = req.body;
        try {
            const user = await User.findOne({ username });
            Tournament.deleteMany({ createdBy: user._id }).catch(async (err) => await errorHandler(null, err, res));
            Team.deleteMany({ createdBy: user._id }).catch(async (err) => await errorHandler(null, err, res));
            Player.deleteMany({ createdBy: user._id }).catch(async (err) => await errorHandler(null, err, res));

            User.findOneAndDelete({ username })
                .catch(async (err) => await errorHandler(null, err, res))
                .then(() => res.status(200).json('Eliminado con exito'))
                .catch(async (err) => await errorHandler(null, err, res));
        } catch (err) {
            await errorHandler(null, err, res);
        }
    },
};
