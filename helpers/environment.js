//module scaffolding
const environment = {};

environment.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: ">r=nBXKRHy(?-MzZlzK01_NNZ]V<sI",
    mxCheck: 5,
}
environment.production = {
    port: 5000,
    envName: 'production',
    secretKey: "M~OwVX[teb+=9O{bWi<2R<m{8><0EQw",
    mxCheck: 5,
}

//get the fire server env
const currentEnv = process.env.NODE_ENV === "staging" ? process.env.NODE_ENV : "production";

// send corresponding  env object 
const envToExport = typeof (environment[currentEnv]) === 'object' ? environment[currentEnv] : environment.staging;

module.exports = envToExport;
