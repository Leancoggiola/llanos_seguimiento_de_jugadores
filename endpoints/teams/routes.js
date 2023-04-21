const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');

const { getTeams, updateTeam, deleteTeam } = require('./controller.js');

router.get('/getTeams', verifyToken, getTeams);
router.post('/postTeam', verifyToken, updateTeam);
router.put('/putTeam', verifyToken, updateTeam);
router.delete('/deleteTeam', verifyToken, deleteTeam);

module.exports = router;
