const DatabaseModel = require('./database/database.model');
const UsersHelper = require('../helpers/users.helpers');

/**
*@class Users Model handler
*Handles all requests related to users
**/
class UsersModel extends DatabaseModel {
    constructor(){
        super();
        /* Check for possible deafult variables */
    }

    /**
    * DOCU: Function to fetch user data
    * Triggered: This is being called when user attempt to login in the website <br>
    * Last Updated Date: October 23, 2022
    * @async
    * @function
    * @memberOf UsersModel
    * @param {String} - "id, email_address"
    * @param {Object} - { email_address: "sample@mail.com", ... }
    * @param {Number} - 1
    * @return {Object} - response_data = { status: true, result: [fetched_data], error: null }
    * @author Jomar
    */
    fetchUserData = async (fields, params, limit) => {
        let response_data = { status: false, result: null, error: null };

        try {
            /* Initialized users table name that can be used in where statement */
            let user_table_feilds = ["id", "email_address", "first_name", "last_name"];
            let where_fields = [];
    
            /* loop through user_table_feilds and check if params field have matching key that can be used in where field */
            for(let key of user_table_feilds){
    
                if(params[key]){
                    where_fields.push(this.mysqlformat(`${key} = ?`, params[key]))
                }
            }
    
            /* Generate select query statement */
            let fetch_user_query = this.mysqlformat(`SELECT ${ fields || "*" } FROM users ${where_fields.length ? `WHERE ${where_fields.join(" AND ")}`  : ""} ${ limit ? `LIMIT ${limit}` : ""}`);
    
            response_data = await this.runQueryStatements(fetch_user_query);
        } 
        catch (error) {
            console.log(error);
            response_data.error = error;
        }

        return response_data;
    }

    /**
    * DOCU: Function verify data if user can login
    * Triggered: This is being called in users.controller.js loginUser() <br>
    * Last Updated Date: October 23, 2022
    * @async
    * @function
    * @memberOf UsersModel
    * @param {Object} - { email_address, password  }
    * @return {Object} - response_data = { status: true, result: null, error: null, message: "User successfully logged in" }
    * @author Jomar
    */
    loginUser = async (params) => {
        let response_data = { status: false, result: null, error: null };

        try {
            let { email_address, password } = params;
            /* Fetch user data using the email provided by user */
            let { status, result: user_data, error } = await this.fetchUserData("id, email_address, password", { email_address }, 1);

            /* Check if user data exist, if so, it means that user was already registered */
            if(status && user_data?.length){
                let [{ password: stored_password }] = user_data;

                let usersHelper = new UsersHelper();
                /* Compare the stored password and the provided by the user */
                let { status: is_match_password, error } = await usersHelper.comparePassword({password, hashed_password: stored_password});

                /* Check if the password match, if so, proceed with the login process */
                if(is_match_password){
                    response_data.status = true;
                    response_data.message = "User successfully logged in";
                }
                else{
                    response_data.error = "Credentials provided did not match our record";
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

    /**
    * DOCU: Function verify data if user can register
    * Triggered: This is being called in users.controller.js registerUser() <br>
    * Last Updated Date: October 23, 2022
    * @async
    * @function
    * @memberOf UsersModel
    * @param {Object} - { first_name, last_name, email_address, password  }
    * @return {Object} - response_data = { status: true, result: [fetched_data], error: null }
    * @author Jomar
    */
    registerUser = async (params) => {
        let response_data = { status: false, result: null, error: null };

        try {
            let { first_name, last_name, email_address, password } = params;
            /* Fetch user data using the provided email address */
            let { result: check_if_user_exist_result } = await this.fetchUserData("id", { email_address }, 1);

            /* Check if user data exist, if not, then proceed with the registration process */
            if(!check_if_user_exist_result?.length){
                let usersHelper = new UsersHelper();
                /* Hash the password provided by user */
                let { status: hash_pasword_status, result: hashed_password } = await usersHelper.hashPassword({password});

                /* Check if the generation of hash password was successful, if so, then proceed with the registration process */
                if(hash_pasword_status){
                    /* Create insert statement query */
                    let reqister_query = this.mysqlformat(`
                        INSERT INTO users (first_name, last_name, email_address, password, created_at, updated_at)
                        VALUES (?, ?, ?, ?, NOW(), NOW())
                    `, [ first_name, last_name, email_address, hashed_password ]);
        
                    let insert_query_status = await this.runQueryStatements(reqister_query);
        
                    /* Check if the insertion of user data was successfull */
                    if(insert_query_status.result.affectedRows > 0){
                        response_data.status = true;
                        response_data.message = "User was successfully created";
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

module.exports = UsersModel;