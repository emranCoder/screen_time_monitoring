//dependence
const data = require('../../library/data');
const { hash, parseJson, randomString } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const { mxCheck } = require('../../helpers/environment');
//module scaffolding
const handler = {};

handler.checkHandler = (reqProp, callBack) => {

    const fireMethod = ['get', 'post', 'put', 'delete'];
    if (fireMethod.indexOf(reqProp.method) < 0) return callBack(405);
    //send users scaffolding the firing method.
    handler._check[reqProp.method](reqProp, callBack);
}

//for user scaffolding
handler._check = {};

//ROUTE 1: Get Users Details:  GET "/user?phone=number". Login required
handler._check.get = (reqProp, callBack) => {
    const query = typeof (reqProp.queryStringObject.id) === 'string' && reqProp.queryStringObject.id.length === 20 ? reqProp.queryStringObject.id : null;

    const token = typeof (reqProp.headerObject.token) === 'string' && reqProp.headerObject.token.length === 20 ? reqProp.headerObject.token : null;

    if (!query && !token) { return callBack(400, { error: "Bad Request!" }); }
    //Get the user
    data.read('checks', query, (err, data) => {
        if (err && !data) { return callBack(404, { error: "The user not exist!" }); }
        const checkData = parseJson(data);
        tokenHandler._token.verify(token, checkData.userPhone, (err) => {
            if (!err) { return callBack(500, { err: "Unable to validate!" }) };

            callBack(200, checkData);
        });
    });
};

//ROUTE 2: POST To Add User:  POST "/user". NO Login required
handler._check.post = (reqProp, callBack) => {
    const protocol = typeof (reqProp.body.protocol) === "string" && ['http', 'https'].indexOf(reqProp.body.protocol) > -1 ? reqProp.body.protocol : false;
    const url = typeof (reqProp.body.url) === "string" && reqProp.body.url.trim().length > 0 ? reqProp.body.url : false;
    const method = typeof (reqProp.body.method) === "string" && ['get', 'post', 'put', 'delete'].indexOf(reqProp.body.method.toLowerCase()) > -1 ? reqProp.body.method : false;
    const successCode = typeof (reqProp.body.successCodes) === "object" && reqProp.body.successCodes instanceof Array ? reqProp.body.successCodes : false;
    const timeOut = typeof (reqProp.body.timeOut) === "number" && reqProp.body.timeOut % 1 == 0 && reqProp.body.timeOut >= 1 && reqProp.body.timeOut <= 5 ? reqProp.body.timeOut : false;

    const tokenID = typeof (reqProp.headerObject.token) === 'string' && reqProp.headerObject.token.length === 20 ? reqProp.headerObject.token : null;

    if (!protocol && !url && !method && !successCode && !timeOut && !tokenID) { return callBack(400, { error: "You have a problem in your request!" }); }


    //get user for token
    data.read('tokens', tokenID, (err, tokenData) => {
        if (err && !tokenData) { callBack(404, { error: "User Not found!" }); }

        const userPhone = parseJson(tokenData).phoneNumber;

        data.read('users', userPhone, (error, user) => {
            if (error && !user) { callBack(404, { error: "User Not found!" }); }
            tokenHandler._token.verify(tokenID, userPhone, (validate) => {
                if (!validate) { return callBack(403, { message: "Authentication failed!" }) }
                const userData = parseJson(user);

                let userCheck = typeof (userData.check) === 'object' && userData.check instanceof Array ? userData.check : [];
                if (userCheck.length < mxCheck) {

                    const checkID = randomString(20);

                    const checkObject = {
                        'id': checkID,
                        userPhone,
                        protocol,
                        url,
                        method,
                        successCode,
                        timeOut
                    }
                    //store it to check  system
                    data.create('checks', checkID, checkObject, (errors) => {
                        if (errors) { return callBack(500, { err: "Server is down!" }) }

                        userData.check = userCheck;
                        userData.check.push(checkID);

                        //update user data
                        data.update('users', userPhone, userData, (err) => {
                            if (err) { return callBack(500, { err: "Server is down!" }) }
                            callBack(200, checkObject);
                        });
                    });
                } else {
                    return callBack(401, { message: "User Already Reach max check limit!" });
                }

            });
        });
    });
};

//ROUTE 3: PUT To Update the User Details:  POST "/user".Login required
handler._check.put = (reqProp, callBack) => {
    const id = typeof (reqProp.body.id) === 'string' && reqProp.body.id.length === 20 ? reqProp.body.id : null;

    const protocol = typeof (reqProp.body.protocol) === "string" && ['http', 'https'].indexOf(reqProp.body.protocol) > -1 ? reqProp.body.protocol : false;
    const url = typeof (reqProp.body.url) === "string" && reqProp.body.url.trim().length > 0 ? reqProp.body.url : false;
    const method = typeof (reqProp.body.method) === "string" && ['get', 'post', 'put', 'delete'].indexOf(reqProp.body.method.toLowerCase()) > -1 ? reqProp.body.method : false;
    const successCode = typeof (reqProp.body.successCodes) === "object" && reqProp.body.successCodes instanceof Array ? reqProp.body.successCodes : false;
    const timeOut = typeof (reqProp.body.timeOut) === "number" && reqProp.body.timeOut % 1 == 0 && reqProp.body.timeOut >= 1 && reqProp.body.timeOut <= 5 ? reqProp.body.timeOut : false;

    const token = typeof (reqProp.headerObject.token) === 'string' && reqProp.headerObject.token.length === 20 ? reqProp.headerObject.token : null;


    if (!id && (!token && !protocol || !url || !method || !successCode || !timeOut)) { return callBack(500, { message: "Bad request!" }) }

    //Get the user
    data.read('checks', id, (err, cData) => {
        if (err && !cData) { return callBack(404, { error: "The user not exist!" }); }
        let checkData = parseJson(cData);
        let phone = checkData.userPhone;
        tokenHandler._token.verify(token, phone, (err) => {
            if (!err) { return callBack(403, { err: "Unable to validate!" }) };
            if (protocol) { checkData.protocol = protocol }
            if (url) { checkData.url = url }
            if (method) { checkData.method = method }
            if (successCode) { checkData.successCode = successCode }
            if (timeOut) { checkData.timeOut = timeOut }
            //update user data
            data.update('checks', id, checkData, (err) => {
                if (err) { return callBack(500, { err: "Server is down!" }) }
                callBack(200, { message: "You got a update!" });
            });
        });
    });

};

//ROUTE 3: Delete The User Details:  POST "/user".Login required
handler._check.delete = (reqProp, callBack) => {

};


module.exports = handler;