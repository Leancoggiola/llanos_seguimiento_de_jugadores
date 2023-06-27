const express = require('express');
const router = express.Router();
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');

const { getTeams, updateTeam, deleteTeam, addTeam } = require('./controller.js');

router.get('/getTeams', verifyToken, getTeams);
router.post('/postTeam', verifyToken, addTeam);
router.put('/putTeam/:id', verifyToken, updateTeam);
router.delete('/deleteTeam/:id', verifyToken, deleteTeam);

module.exports = router;
