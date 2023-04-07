const express = require('express');
const router = express.Router();

const { getTeams, postTeam, putTeam, deleteTeam } = require('./controller.js');

router.get('/getTeams', getTeams);
router.post('/postTeam', postTeam)
router.put('/putTeam', putTeam)
router.delete('/deleteTeam', deleteTeam)

module.exports = router;