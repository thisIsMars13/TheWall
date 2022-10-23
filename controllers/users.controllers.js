const GlobalHelper = require('../helpers/global.helpers');
const UserModels = require('../models/users.model');
/**
*@class Users handler
*Handles all requests related to users
**/
class UserControllers {

    constructor(){
        /* Plan on default variable */
    }

    /**
    * DOCU: Function login a user a generate a session
    * Triggered: This is being called when user attempt to login in the website<br>
    * Last Updated Date: October 23, 2022
    * @async
    * @function
    * @memberOf UserControllers
    * @return {Object} - response_data = { status: true, result: null, error: null, message: "User successfully logged in"}
    * @author Jomar
    */
    loginUser = async function(req, res = undefined) {
        let response_data = { status: false, result: null, error: null };
        try {
            let globalHelper = new GlobalHelper();

            /* Validate / Sanitize data coming from user */
            let { status, result: login_params, error: sanitation_error } = globalHelper.validateField(["email_address", "password"], [], req)
        
            /* If data succesfuly sanitized, proceed with login process */
            if( status ){
                let userModels = new UserModels();
                response_data = await userModels.loginUser(login_params);

                /* If login process is succesful, generate session */
                if(response_data.status){
                    req.session.authenticated = true;
                }
            }
            else{
                response_data.error = sanitation_error;
            }
        } 
        catch (error) {
            console.log(error)
            response_data.error = error;
        }

        res.json(response_data);
    }

    /**
    * DOCU: Function to register a user in the application
    * Triggered: This is being called when user attempt to register in the application <br>
    * Last Updated Date: October 23, 2022
    * @async
    * @function
    * @memberOf UserControllers
    * @return {Object} - response_data = { status: true, result: null, error: null, message: "User was successfully created"}
    * @author Jomar
    */
    registerUser = async function(req, res = undefined) {
        let response_data = { status: false, result: null, error: null }
        try {
            let globalHelper = new GlobalHelper();
            /* Validate / Sanitize data coming from user */
            let { status, result: register_params, error: sanitation_error } =  globalHelper.validateField(["email_address", "password", "confirm_password", "first_name", "last_name"], [], req);

            /* If data succesfuly sanitized, proceed with registration process */
            if( status ){
                let userModels = new UserModels();
                response_data = await userModels.registerUser(register_params); 
            }
            else{
                response_data.error = sanitation_error;
            }
        }
        catch (error) {
            console.log(error)
            response_data.error;
        }

        res.json(response_data);
    }
}

module.exports = UserControllers;