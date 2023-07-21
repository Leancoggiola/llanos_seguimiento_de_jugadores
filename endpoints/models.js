const mongoose = require('mongoose');
const { Schema } = mongoose;

const matchDetailsObj = {
    type: {
        type: String,
        required: [true, 'Se requiere tipo'],
        enum: ['gol', 'sin goles', 'tarjeta amarilla', 'tarjeta roja'],
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: 'players',
        required: false,
    },
    time_in_match: { type: Number, required: true },
};

const matchObj = {
    date: { type: Date, required: false, default: null },
    teams: {
        type: [Schema.Types.ObjectId],
        ref: 'teams',
        required: [true, 'Se requieren los equipos'],
    },
    details: {
        type: [matchDetailsObj],
        required: false,
        default: [],
    },
    winner: {
        type: String,
        require: false,
        default: null,
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
};

const groupObj = {
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
        type: [matchObj],
        required: false,
        default: [],
    },
    table: {
        type: Array,
        required: false,
        default: [],
    },
    isFinished: {
        type: Boolean,
        required: false,
        default: false,
    },
};

const knockoutObj = {
    stage: {
        type: String,
        required: [true, 'Se requiere etapa'],
    },
    teams: {
        type: [Schema.Types.ObjectId],
        ref: 'teams',
        required: false,
        default: [],
    },
    matchs: {
        type: [matchObj],
        required: false,
        default: [],
    },
    order: {
        type: Number,
        required: [true, 'Se requiere order'],
    },
    isFinished: {
        type: Boolean,
        required: false,
        default: false,
    },
};

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
            partialFilterExpression: { dni: { $type: 'string' } },
        },
        lowercase: true,
        trim: true,
        maxLength: 8,
        match: [/^\d{7,8}$/, 'Ingresa un DNI valido'],
    },
    sanction: { type: Number, required: false, min: 0, max: 99, default: 0 },
    initial_sanction: { type: Number, required: false, min: 0, max: 99, default: 0 },
    sanction_date: { type: Date, required: false, default: null },
    age: { type: Number, required: false, min: 1, max: 99 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    team_id: { type: Schema.Types.ObjectId, ref: 'teams', default: null },
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
    tourney_ids: { type: [Schema.Types.ObjectId], ref: 'tournaments', default: [] },
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
        type: [groupObj],
        ref: 'groups',
        required: false,
        default: [],
    },
    knockout: {
        type: [knockoutObj],
        ref: 'knockout',
        required: false,
        default: [],
    },
    configs: {
        type: {},
        required: false,
        default: {},
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
    category: {
        type: String,
        required: [true, 'Se requiere categoria'],
        enum: ['Veterano', 'Libre'],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    createdOn: { type: Date, required: [true, 'Se requiere fecha de creacion'] },
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

const Player = mongoose.model('players', playerSchema);
const Team = mongoose.model('teams', teamsSchema);
const Tournament = mongoose.model('tournaments', tournamentsSchema);
const User = mongoose.model('users', userSchema);

module.exports = { User, Tournament, Team, Player };
