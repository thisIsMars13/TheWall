const { hash, compare } = require('bcrypt');

/**
* @class UsersHelper
* Handles helpers that will be used in Users request
**/
class UsersHelper {
    constructor(){
        /* Plan default variables */
    }

    /**
    * DOCU: Function to generate hash passwords
    * Triggered: This is being called users.model.js registerUser() <br>
    * Last Updated Date: October 23, 2022
    * @async
    * @function
    * @memberOf UsersHelper
    * @return {Object} - response_data = { status: true, result: hash_pasword, error: null }
    * @author Jomar
    */
    hashPassword = async (params) => {
        let response_data = { status: false, result: null, error: null};

        try {
            let { password } = params;

            /* Generate hashed password for using bcrypt */
            let hash_pasword = await hash(password, 10);

            response_data.status = true;
            response_data.result = hash_pasword;
        } 
        catch (error) {
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    /**
    * DOCU: Function to compare password provided by user and the stored hash password
    * Triggered: This is being called users.model.js loginUser() <br>
    * Last Updated Date: October 23, 2022
    * @async
    * @function
    * @memberOf UsersHelper
    * @return {Object} - response_data = { status: true, result: null, error: null }
    * @author Jomar
    */
    comparePassword = async (params) => {
        let response_data = { status: false, result: null, error: null};

        try {
            let { password, hashed_password } = params;

            /* Check if the user provided a password and the hashed password exist, if so, proceed with the comparing of password */
            if(password && hashed_password){
                response_data.status = await compare(password, hashed_password);
            }
            else{
                response_data.error = "Missing password parameters";
            }
        } 
        catch (error) {
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = UsersHelper;