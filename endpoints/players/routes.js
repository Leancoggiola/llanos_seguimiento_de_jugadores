const express = require('express');
const router = express.Router();

const { getPlayers, postPlayer, putPlayer, deletePlayer }= require('./controller.js');

router.get('/getPlayers', getPlayers);
router.delete('/deletePlayer', deletePlayer);
router.post('/postPlayer', postPlayer);
router.put('/putPlayer', putPlayer);

module.exports =  router;