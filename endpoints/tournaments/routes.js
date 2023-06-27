const express = require('express');
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { getTournaments, deleteTournaments, updateTournaments, addTournament } = require('./controller.js');

router.get('/getTournaments', verifyToken, getTournaments);
router.delete('/deleteTournaments/:id', verifyToken, deleteTournaments);
router.post('/postTournaments', verifyToken, addTournament);
router.put('/putTournaments/:id', verifyToken, updateTournaments);

module.exports = router;
