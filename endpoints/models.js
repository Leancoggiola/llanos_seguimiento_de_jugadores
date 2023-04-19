const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const playerSchema = Schema({
    name: {
        type: String,
        required: [true, 'Se requiere nombre'],
        lowercase: true,
        trim: true,
    },
    dni: {
        type: String,
        required: [true, 'Se requiere DNI'],
        sparse: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxLength: 8,
        match: /^\d{7,8}$/,
        default: null,
    },
    edad: { type: Number, required: false, min: 1, max: 99 },
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
    },
});

const tournamentsSchema = Schema({
    name: {
        type: String,
        required: [true, 'Se requiere nombre'],
        lowercase: true,
        trim: true,
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
    status: {
        type: String,
        required: [true, 'Se requiere estado'],
        enum: ['Nuevo', 'Jugando', 'Terminado'],
    },
    type: {
        type: String,
        required: [true, 'Se requiere tipo'],
        enum: [
            'Liga',
            'Eliminatoria',
            'Liga+Eliminatoria',
            'Grupos+Eliminatoria',
        ],
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
});

const MatchDetails = mongoose.model('matchDetails', matchDetailsSchema);
const Match = mongoose.model('matches', matchSchema);
const User = mongoose.model('users', userSchema);
const Tournament = mongoose.model('tournaments', tournamentsSchema);
const Team = mongoose.model('teams', teamsSchema);
const Player = mongoose.model('players', playerSchema);

module.exports = { User, Tournament, Team, Player, Match, MatchDetails };
