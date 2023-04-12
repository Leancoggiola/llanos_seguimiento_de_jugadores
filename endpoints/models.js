const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const playerSchema = mongoose.Schema({
    name: { type: String, required: [true, "Se requiere nombre"] },
    surname: { type: String, required: [true, "Se requiere apellido"] },
    dni: { type: Number, required: [true, "Se requiere DNI"], unique: true},
    yellow_cards_per_match: { type: Object, require: false},
    red_cards_per_match: { type: Object, require: false},
    sanction_per_tourney: { type: Object, require: false},
    createdBy: { type: mongoose.ObjectId, required: true }
})

const teamsSchema = mongoose.Schema({
    name: { type: String, required: [true, "Se requiere nombre"] },
    players: { type: [playerSchema], required: [true, "Se requieren jugadores"] },
    createdBy: { type: mongoose.ObjectId, required: true }
})

const matchDetailsSchema = mongoose.Schema({
    type: { type: String, required: [true, "Se requiere tipo"], enum: ["Gol", "Tarjeta Amarilla", "Tarjeta Roja"]},
    player: { type: playerSchema, required: [true, "Se requiere jugador"] },
    time_in_match: { type: Number, required: [true, "Se requiere minuto"] },
})

const matchSchema = mongoose.Schema({
    date: { type: Date, required: false },
    teams: { type: [teamsSchema], required: [true, "Se requieren los equipos"]},
    details: {type: [matchDetailsSchema], required: false}
})

const tournamentsSchema = mongoose.Schema({
    name: { type: String, required: [true, "Se requiere nombre"] },
    teams: { type: [teamsSchema], required: false},
    matchs: { type: Object, required: false},
    status: { type: String, required: [true, "Se requiere estado"], enum: ["Creado", "Iniciado", "Terminado"]},
    type: { type: String, required: [true, "Se requiere tipo"], enum: ["Liga", "Eliminatoria", "Liga+Eliminatoria", "Grupos+Eliminatoria"]},
    createdBy: { type: mongoose.ObjectId, required: true }
})

const userSchema = mongoose.Schema({
    username: {type: String, required: [true, "Se requiere usuario"], unique: true},
    password: { type: String, required: [true, "Se requiere contraseña"]},
    tournaments: { type: [tournamentsSchema], required: false}
})

userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({username})
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
        throw Error("Contraseña incorrecta")
    }
    throw Error("Usuario no encontrado")
}

const Match = mongoose.model('match', matchSchema)
const User = mongoose.model('users', userSchema);
const Tournament = mongoose.model('tournaments', tournamentsSchema);
const Team = mongoose.model('teams', teamsSchema);
const Player = mongoose.model('players', playerSchema);

module.exports = { User, Tournament, Team, Player, Match }