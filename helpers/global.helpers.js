/**
* @class GlobalHelper
* Handles helpers that can be used in general
**/
class GlobalHelper {

    constructor(){
        /* Needs constructor variable */
    }

    /**
    * DOCU: Function to sanitize or validate data from users
    * Triggered: This is being called in most controller functions <br>
    * Last Updated Date: October 23, 2022
    * @async
    * @function
    * @memberOf GlobalHelper
    * @return {Object} - response_data = { status: true, result: {sanitized_data}, error: null }
    * @author Jomar
    */
    validateField = (required_field, optional_field = [], req) =>{
        let response_data = { status: false, result: [], error: null }

        try {
            let all_fields = [ ...required_field, ...optional_field ]
            let missing_fields = [];
            let sanitized_data  = {};

            /* Loop through all provided fields and check if there are undefined param or undeclared params */
            for( let index in all_fields){
                let param = all_fields[index];
                let param_value = req.body[param] || "";

                /* Check if there are undefined params and if the undefined params is required, if so, add it to missing fields */
                if(String(param_value).trim() === "" && required_field.includes(param)){
                    missing_fields.push(param);
                }
                else{
                    sanitized_data[param] = param_value;
                }
            }

            /* Check if there are missing required fields, if none, return result as success */
            if(missing_fields.length === 0){
                response_data.status = true;
                response_data.result = sanitized_data;
            }
            else{
                response_data.error = "Missing parameters";
                response_data.result = missing_fields;
            }
        } 
        catch (error) {
            console.log(error);
        }

        return response_data;
    }
}

module.exports = GlobalHelper;