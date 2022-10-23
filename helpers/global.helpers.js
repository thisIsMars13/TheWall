
class GlobalHelper {

    constructor(){
        /* Needs constructor variable */
    }
    
    validateField = (required_field, optional_field = [], req) =>{
        let response_data = { status: false, result: [], error: null }

        try {
            let all_fields = [ ...required_field, ...optional_field ]
            let missing_fields = [];
            let sanitized_data  = {};

            for( let index in all_fields){
                let param = all_fields[index];
                let param_value = req.body[param] || "";

                if(String(param_value).trim() === "" && required_field.includes(param)){
                    missing_fields.push(param);
                }
                else{
                    sanitized_data[param] = param_value;
                }
            }

            if(missing_fields.length === 0){
                response_data.status = true;
                response_data.result = sanitized_data;
            }
            else{
                response_data.error = "Missing parameters";
            }
        } 
        catch (error) {
            console.log(error);
        }

        return response_data;
    }
}

module.exports = GlobalHelper;