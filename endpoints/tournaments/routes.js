const express = require('express');
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { getTournaments, deleteTournaments, postTournaments, putTournaments }= require('./controller.js');

router.get('/getTournaments', verifyToken, getTournaments);
router.delete('/deleteTournaments', verifyToken, deleteTournaments);
router.post('/postTournaments', verifyToken, postTournaments);
router.put('/putTournaments', verifyToken, putTournaments);

module.exports =  router;