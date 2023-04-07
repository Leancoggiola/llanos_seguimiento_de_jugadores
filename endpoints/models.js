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

const tournamentsSchema = mongoose.Schema({
    name: { type: String, required: [true, "Se requiere nombre"] },
    starting_date: {type: Date, required: [true, "Se requiere fecha de inicio"]},
    amount_dates: {type: Number, required: [true, "Se requiere total de fechas"]},
    teams: { type: [teamsSchema], required: [true, "Se requieren equipos a participar"]},
    status: { type: String, required: [true, "Se requiere estado"], enum: ["Creado", "Iniciado", "Terminado"]},
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

const User = mongoose.model('users', userSchema);
const Tournament = mongoose.model('tournaments', tournamentsSchema);
const Team = mongoose.model('teams', teamsSchema);
const Player = mongoose.model('players', playerSchema);

module.exports = { User, Tournament, Team, Player }