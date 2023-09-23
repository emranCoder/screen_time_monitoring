//module scaffolding
const environment = {};

environment.staging = {
    port: 3000,
    envName: 'staging',
}
environment.production = {
    port: 5000,
    envName: 'production',
}

//get the fire server env
const currentEnv = process.env.NODE_ENV === "staging" ? process.env.NODE_ENV : "production";

// send corresponding  env object 
const envToExport = typeof (environment[currentEnv]) === 'object' ? environment[currentEnv] : environment.staging;

module.exports = envToExport;
