const express = require('express');
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { getTournaments, getTournamentDetails, deleteTournaments, updateTournaments, updateTournamentDetails, addTournament } = require('./controller.js');

router.get('/getTournaments', verifyToken, getTournaments);
router.get('/getTournamentDetails/:id', verifyToken, getTournamentDetails);
router.delete('/deleteTournaments/:id', verifyToken, deleteTournaments);
router.post('/postTournaments', verifyToken, addTournament);
router.put('/putTournaments/:id', verifyToken, updateTournaments);
router.put('/putTournamentsDetails/:id', verifyToken, updateTournamentDetails);

module.exports = router;
