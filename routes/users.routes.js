const express = require('express');
const UserControllers = require('../controllers/users.controllers');
const UserRouter = express.Router();

let userControllers = new UserControllers()

UserRouter.post('/login', userControllers.loginUser);
UserRouter.post('/register', userControllers.registerUser);

module.exports =  UserRouter;
