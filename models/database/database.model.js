const db = require('./connections.model')
const { format } = require('mysql')

/**
*@class Database handler
*Handles all requests related to database communications
**/
class DatabaseModel {
    constructor(){
        this.mysqlformat = format;
    }

    /**
    * DOCU: Function to run query statements
    * Triggered: This is being called in most functions that require communications with database <br>
    * Last Updated Date: October 23, 2022
    * @async
    * @function
    * @memberOf DatabaseModel
    * @return {Object} - response_data = { status: true, result: [fetched-data], error: null }
    * @author Jomar
    */
    runQueryStatements = (query) => {

        return new Promise((resolve, reject) => {
                db.query(query, function(error, result){
                    let response_data = { status: false, result: null, error: null};
                    
                    if(error){
                        response_data.error = error;
                        resolve(response_data);
                    }
                    else{
                        response_data.status = true;
                        response_data.result = result;
                        resolve(response_data);
                    }
                })
            }
        )
    }
}

module.exports = DatabaseModel;