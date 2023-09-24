//dependence
const data = require('../../library/data');
const { hash, parseJson, randomString } = require('../../helpers/utilities');
const { resourceUsage } = require('process');

//module scaffolding
const handler = {};

handler.tokenHandler = (reqProp, callBack) => {

    const fireMethod = ['get', 'post', 'put', 'delete'];
    if (fireMethod.indexOf(reqProp.method) < 0) return callBack(405);
    //send token scaffolding the firing method.
    handler._token[reqProp.method](reqProp, callBack);
}

//for user scaffolding
handler._token = {};

//Auth token get
handler._token.get = (reqProp, callBack) => {
    const tokenId = typeof (reqProp.queryStringObject.id) === 'string' && reqProp.queryStringObject.id.length === 20 ? reqProp.queryStringObject.id : null;

    if (!tokenId) { return callBack(400, { error: "Bad Request!" }); }

    //Get the user
    data.read('tokens', tokenId, (err, tokenData) => {

        if (err && !tokenData) { return callBack(404, { error: "The user not exist!" }); }
        const token = parseJson(tokenData);
        callBack(200, token);
    });

};

//Generate Auth token
handler._token.post = (reqProp, callBack) => {
    const phoneNumber = typeof (reqProp.body.phone) === 'string' && reqProp.body.phone.length === 11 ? reqProp.body.phone : null;

    const pwd = typeof (reqProp.body.password) === 'string' && reqProp.body.password.length > 0 ? reqProp.body.password : null;

    if (!phoneNumber && !pwd) { return callBack(500, { message: "Bad request!" }) }

    data.read('users', phoneNumber, (err, user) => {
        if (err) { return callBack(500, { message: "Server end error!" }) }
        const userData = parseJson(user);
        const hashPwd = hash(pwd);
        if (userData.pwd === hash(pwd)) {

            let tokenID = randomString(20);
            let expires = Date.now() + 60 * 60 * 1000;
            let tokenObject = {
                'id': tokenID,
                'phoneNumber': phoneNumber,
                'expires': expires,
            }
            //store token
            data.create('tokens', tokenID, tokenObject, (err) => {
                if (err) { return callBack(404, { message: "Server is down!" }) }
                callBack(200, tokenObject);

            });

        } else {
            callBack(404, { error: "Wrong User Name & Password!" })
        }
    });
};

//Extend Auth token
handler._token.put = (reqProp, callBack) => {
    const tokenId = typeof (reqProp.body.id) === 'string' && reqProp.body.id.length === 20 ? reqProp.body.id : null;

    const extend = typeof (reqProp.body.extend) === 'boolean' ? reqProp.body.extend : false;

    if (!tokenId && !extend) { return callBack(500, { message: "Bad request!" }) }

    data.read('tokens', tokenId, (err, tokenData) => {
        if (err) { return callBack(500, { message: "Server end error!" }) }

        const token = parseJson(tokenData);

        if (token.expires > Date.now()) {

            token.expires = Date.now() + 60 * 60 * 1000;
            //update token expire date
            data.update('tokens', tokenId, token, (err) => {
                if (err) { return callBack(404, { message: "Server is down!" }) }
                callBack(200, { message: "Token extended!" });
            });


        } else {
            callBack(500, { err: "Your Token expired already!" });
        }
    });

};

//Delete Auth token
handler._token.delete = (reqProp, callBack) => {
    const tokenId = typeof (reqProp.body.id) === 'string' && reqProp.body.id.length === 20 ? reqProp.body.id : null;

    if (!tokenId) { return callBack(400, { error: "Bad Request!" }); }

    //Get the user
    data.delete('tokens', tokenId, (err) => {
        if (err) { return callBack(404, { error: "The user not exist!" }); }
        callBack(200, { message: "Token Deleted!" });
    });
};

handler._token.verify = (id, phoneNumber, callBack) => {
    data.read('tokens', id, (err, tokenData) => {
        if (err && !tokenData) { return callBack(false); }
        const token = parseJson(tokenData);
        if (token.phoneNumber === phoneNumber && token.expires > Date.now()) {
            callBack(true);
        } else {
            return callBack(false);
        }
    })
}


module.exports = handler;