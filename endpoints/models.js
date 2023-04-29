const mongoose = require('mongoose');
const { Schema } = mongoose;

const playerSchema = Schema({
    name: {
        type: String,
        required: [true, 'Se requiere nombre'],
        lowercase: true,
        trim: true,
        maxLength: 30,
    },
    dni: {
        type: String,
        required: false,
        index: {
            unique: true,
            partialFilterExpression: { dni: { $exists: true } },
        },
        lowercase: true,
        trim: true,
        maxLength: 8,
        match: [/^\d{7,8}$/, 'Ingresa un DNI valido'],
    },
    age: { type: Number, required: false, min: 1, max: 99 },
    // yellow_cards_per_match: { type: Object, require: false},
    // red_cards_per_match: { type: Object, require: false},
    // sanction_per_tourney: { type: Object, require: false},
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

const teamsSchema = Schema({
    name: {
        type: String,
        required: [true, 'Se requiere nombre'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    players: { type: [Schema.Types.ObjectId], ref: 'players', default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
});

const matchDetailsSchema = Schema({
    type: {
        type: String,
        required: [true, 'Se requiere tipo'],
        enum: ['Gol', 'Tarjeta Amarilla', 'Tarjeta Roja'],
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: 'players',
        required: [true, 'Se requiere jugador'],
    },
    time_in_match: { type: Number, required: [true, 'Se requiere minuto'] },
});

const matchSchema = Schema({
    date: { type: Date, required: false },
    teams: {
        type: [Schema.Types.ObjectId],
        ref: 'teams',
        required: [true, 'Se requieren los equipos'],
    },
    details: {
        type: [Schema.Types.ObjectId],
        ref: 'matchDetails',
        required: false,
        default: [],
    },
    week: {
        type: Number,
        require: [true, 'Jornada requerida'],
        default: -1,
    },
    matchOrder: {
        type: Number,
        require: [true, 'Partido orden requerida'],
        default: -1,
    },
});

const groupSchema = Schema({
    name: {
        type: String,
        required: false,
    },
    teams: {
        type: [Schema.Types.ObjectId],
        ref: 'teams',
        required: false,
        default: [],
    },
    matchs: {
        type: [Schema.Types.ObjectId],
        ref: 'matches',
        required: false,
        default: [],
    },
});

const tournamentsSchema = Schema({
    name: {
        type: String,
        required: [true, 'Se requiere nombre'],
        lowercase: true,
    },
    teams: {
        type: [Schema.Types.ObjectId],
        ref: 'teams',
        required: false,
        default: [],
    },
    groups: {
        type: [Schema.Types.ObjectId],
        ref: 'groups',
        required: false,
        default: [],
    },
    configs: {
        type: [{}],
        required: false,
        default: [],
    },
    status: {
        type: String,
        required: [true, 'Se requiere estado'],
        enum: ['Nuevo', 'Jugando', 'Terminado'],
    },
    type: {
        type: String,
        required: [true, 'Se requiere tipo'],
        enum: ['Liga', 'Eliminatoria', 'Liga+Eliminatoria', 'Grupos+Eliminatoria'],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
});

const userSchema = Schema({
    username: {
        type: String,
        required: [true, 'Se requiere usuario'],
        unique: true,
    },
    password: { type: String, required: [true, 'Se requiere contraseña'] },
    tournaments: {
        type: [tournamentsSchema],
        ref: 'tournaments',
        required: false,
    },
    groupConfig: {
        totalGroups: {
            type: String,
            default: '1',
            match: [/^\d{1,2}$/, 'Ingresa un numero valido'],
        },
        enconters: {
            type: String,
            default: '1',
            match: [/^\d{1,2}$/, 'Ingresa un numero valido'],
        },
        winPnts: {
            type: String,
            default: '3',
            match: [/^\d{1,2}$/, 'Ingresa un numero valido'],
        },
        drawPnts: {
            type: String,
            default: '1',
            match: [/^\d{1,2}$/, 'Ingresa un numero valido'],
        },
        losePnts: {
            type: String,
            default: '0',
            match: [/^\d{1,2}$/, 'Ingresa un numero valido'],
        },
        nextStepRules: {
            type: String,
            default: 'Total',
        },
        draftType: {
            type: String,
            default: 'random',
            enum: ['random', 'manual'],
        },
    },
    knockoutConfig: {},
});

const MatchDetails = mongoose.model('matchDetails', matchDetailsSchema);
const Match = mongoose.model('matches', matchSchema);
const Group = mongoose.model('groups', groupSchema);
const User = mongoose.model('users', userSchema);
const Tournament = mongoose.model('tournaments', tournamentsSchema);
const Team = mongoose.model('teams', teamsSchema);
const Player = mongoose.model('players', playerSchema);

module.exports = { User, Tournament, Team, Player, Match, MatchDetails };
