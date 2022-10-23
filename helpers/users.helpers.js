const { hash, compare } = require('bcrypt');

class UsersHelper {
    constructor(){
        /* Plan default variables */
    }

    hashPassword = async (params) => {
        let response_data = { status: false, result: null, error: null};

        try {
            let { password } = params;

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

    comparePassword = async (params) => {
        let response_data = { status: false, result: null, error: null};

        try {
            let { password, hashed_password } = params;

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