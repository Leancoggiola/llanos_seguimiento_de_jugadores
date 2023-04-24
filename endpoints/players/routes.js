const express = require('express');
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { getPlayers, updatePlayer, deletePlayer } = require('./controller.js');

router.get('/getPlayers', verifyToken, getPlayers);
router.delete('/deletePlayer', verifyToken, deletePlayer);
router.post('/postPlayer', verifyToken, updatePlayer);
router.put('/putPlayer', verifyToken, updatePlayer);

module.exports = router;
