const express = require('express');
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { getTournaments, deleteTournaments, updateTournaments } = require('./controller.js');

router.get('/getTournaments', verifyToken, getTournaments);
router.delete('/deleteTournaments', verifyToken, deleteTournaments);
router.post('/postTournaments', verifyToken, updateTournaments);
router.put('/putTournaments', verifyToken, updateTournaments);

module.exports = router;
