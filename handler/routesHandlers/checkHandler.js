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

};

//ROUTE 3: Delete The User Details:  POST "/user".Login required
handler._check.delete = (reqProp, callBack) => {

};


module.exports = handler;