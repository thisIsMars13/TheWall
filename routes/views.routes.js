const express = require('express');
const UserControllers = require('../controllers/users.controllers');
const ViewRouter = express.Router();

/**
* DOCU: Function to handle all api routes related to users request
* Triggered: This is being called in all users api requests on the website <br>
* Last Updated Date: October 23, 2022
* @async
* @class
* @author Jomar
*/
let userControllers = new UserControllers()
ViewRouter.get('/login', userControllers.renderLogin);

module.exports =  ViewRouter;