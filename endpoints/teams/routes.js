const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');

const { getTeams, postTeam, putTeam, deleteTeam } = require('./controller.js');

router.get('/getTeams',verifyToken , getTeams);
router.post('/postTeam', verifyToken, postTeam)
router.put('/putTeam', verifyToken, putTeam)
router.delete('/deleteTeam', verifyToken, deleteTeam)

module.exports = router;