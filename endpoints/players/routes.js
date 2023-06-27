const express = require('express');
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { getPlayers, updatePlayer, deletePlayer, addPlayer } = require('./controller.js');

router.get('/getPlayers', verifyToken, getPlayers);
router.delete('/deletePlayer/:id', verifyToken, deletePlayer);
router.post('/postPlayer', verifyToken, addPlayer);
router.put('/putPlayer/:id', verifyToken, updatePlayer);

module.exports = router;
