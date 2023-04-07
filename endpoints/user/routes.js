const express = require('express');
const { checkUser } = require('../../middlewares/AuthMiddlewares.js');
const router = express.Router();

const { login, postUser, deleteUser }= require('./controller.js');

router.post('/login', login);
router.post('/postUser', postUser);
router.post('/', checkUser)
router.delete('/deleteUser',checkUser, deleteUser);

module.exports =  router;