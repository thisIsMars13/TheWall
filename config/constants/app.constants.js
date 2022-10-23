const { load } = require("js-yaml");
const { readFileSync } = require("fs");
const path = require("path")

let AppConstants = {};

try {
    let env_file = `${ process.env.NODE_ENV || "development" }.env.yml`;
    
    let env_contents = readFileSync(path.join(__dirname,`../${env_file}`), 'utf8');
    let data = load(env_contents);

    for(let key in data){
        AppConstants[key] = data[key];
    }


} 
catch (error) {
    console.log(`Failed to load environment constants.`, error);
    process.exit(1);
}

module.exports = AppConstants;