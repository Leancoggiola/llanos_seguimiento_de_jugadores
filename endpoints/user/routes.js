const express = require('express');
const { verifyToken } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { isLogged, login, postUser, deleteUser }= require('./controller.js');

router.get('/', verifyToken, isLogged);
router.post('/login', login);
router.post('/postUser', postUser);
router.delete('/deleteUser',verifyToken, deleteUser);

module.exports =  router;