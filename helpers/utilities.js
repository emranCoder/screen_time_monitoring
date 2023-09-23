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

    } else { return false; }

}

module.exports = utilities;