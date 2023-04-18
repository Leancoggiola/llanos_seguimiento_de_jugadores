const express = require('express');
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { getPlayers, postPlayer, putPlayer, deletePlayer }= require('./controller.js');

router.get('/getPlayers', verifyToken, getPlayers);
router.delete('/deletePlayer', verifyToken, deletePlayer);
router.post('/postPlayer', verifyToken, postPlayer);
router.put('/putPlayer', verifyToken, putPlayer);

module.exports =  router;