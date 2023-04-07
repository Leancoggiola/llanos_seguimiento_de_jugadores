const express = require('express');
const { checkUser } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { getTournaments, deleteTournaments, postTournaments, putTournaments }= require('./controller.js');

router.get('/getTournaments', getTournaments);
router.delete('/deleteTournaments', checkUser, deleteTournaments);
router.post('/postTournaments', checkUser, postTournaments);
router.put('/putTournaments', checkUser, putTournaments);

module.exports =  router;