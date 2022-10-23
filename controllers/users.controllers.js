const GlobalHelper = require('../helpers/global.helpers');
const UserModels = require('../models/users.model');

class UserControllers {

    constructor(){
    }

    loginUser = async function(req, res = undefined) {
        let response_data = { status: false, result: null, error: null };
        try {
            let globalHelper = new GlobalHelper();
            let { status, result: login_params, error: sanitation_error } = globalHelper.validateField(["email_address", "password"], [], req)
        
            if( status ){
                let userModels = new UserModels();
                response_data = await userModels.loginUser(login_params);

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

    registerUser = async function(req, res = undefined) {
        let response_data = { status: false, result: null, error: null }
        try {
            let globalHelper = new GlobalHelper();
            let { status, result: register_params, error: sanitation_error } =  globalHelper.validateField(["email_address", "password", "confirm_password", "first_name", "last_name"], [], req);

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