const DatabaseModel = require('./database/database.model');
const UsersHelper = require('../helpers/users.helpers')

class Users extends DatabaseModel {
    constructor(){
        super();
        /* Check for possible deafult variables */
    }

    fetchUserData = async (fields, params, limit) => {
        let response_data = { status: false, result: null, error: null };

        try {
            let user_table_feilds = ["id", "email_address", "first_name", "last_name"];
            let where_fields = [];
    
            for(let key of user_table_feilds){
    
                if(params[key]){
                    where_fields.push(this.mysqlformat(`${key} = ?`, params[key]))
                }
            }
    
            let fetch_user_query = this.mysqlformat(`SELECT ${ fields || "*" } FROM users ${where_fields.length ? `WHERE ${where_fields.join(" AND ")}`  : ""} ${ limit ? `LIMIT ${limit}` : ""}`);
    
            response_data = await this.runQueryStatements(fetch_user_query);
        } 
        catch (error) {
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    loginUser = async (params) => {
        let response_data = { status: false, result: null, error: null };

        try {
            let { email_address, password } = params;
            let { status, result: user_data, error } = await this.fetchUserData("id, email_address, password", { email_address }, 1);

            if(status && user_data?.length){
                let [{ password: stored_password }] = user_data;

                let usersHelper = new UsersHelper();
                let { status: is_match_password, error } = await usersHelper.comparePassword({password, hashed_password: stored_password});

                if(is_match_password){
                    response_data.status = true;
                    response_data.message = "User successfully logged in";
                }
                else{
                    response_data.error = error;
                }
            }
            else{
                response_data.error = error || "User is not registered. Please sign up";
            }
        } 
        catch (error) {
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    registerUser = async (params) => {
        let response_data = { status: false, result: null, error: null };

        try {
            let { first_name, last_name, email_address, password } = params;

            let { result: check_if_user_exist_result } = await this.fetchUserData("id", { email_address }, 1);

            if(!check_if_user_exist_result?.length){
                let usersHelper = new UsersHelper();
                let { status: hash_pasword_status, result: hashed_password } = await usersHelper.hashPassword({password});

                if(hash_pasword_status){

                    let reqister_query = this.mysqlformat(`
                        INSERT INTO users (first_name, last_name, email_address, password, created_at, updated_at)
                        VALUES (?, ?, ?, ?, NOW(), NOW())
                    `, [ first_name, last_name, email_address, hashed_password ]);
        
                    let insert_query_status = await this.runQueryStatements(reqister_query);
        
                    if(insert_query_status.result.affectedRows > 0){
                        response_data.status = true;
                        response_data.result = insert_query_status.result;
                    }
                }
                else{
                    response_data.error = "Failed to generate hash passowrd"
                }

            }
            else{
                response_data.error = "Email address was already in use";
            }
        } 
        catch (error) {
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = Users;