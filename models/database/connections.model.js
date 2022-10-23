const mysql = require("mysql");
const { DATABASE } = require("../../config/constants/app.constants");

const con = mysql.createConnection({ ...DATABASE })

con.connect(err => {
    if(err) {
        throw err;
    }
})

module.exports = con;