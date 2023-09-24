//module scaffolding
const crypto = require('crypto');
const environment = require('../helpers/environment');

const utilities = {};

utilities.parseJson = (str) => {
    let output = {};
    if (typeof (str) === "string" && str.length > 0) {
        output = JSON.parse(str);
    } else { output = {}; }
    return output;
}

utilities.hash = (str) => {
    if (typeof (str) === "string" && str.length > 0) {

        const hash = crypto.createHash('sha256', environment.secretKey).update(str).digest('hex');
        return hash;

    } else { return false; }

}

utilities.randomString = (strLn) => {
    if (typeof (strLn) === 'number' && strLn > 0) {

        const block = "JQsx4N#R!kk$tAOrLHFnz#KoiY&5kpvSv8Be";
        let randomString = '';
        for (let i = 1; i <= strLn; i++) {
            let str = block.charAt(Math.floor(Math.random() * block.length));
            randomString += str;
        }
        return randomString;
    } else { return false; }

}

module.exports = utilities;