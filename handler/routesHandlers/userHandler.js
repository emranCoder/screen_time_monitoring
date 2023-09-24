//dependence
const data = require('../../library/data');
const { hash, parseJson } = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');

//module scaffolding
const handler = {};

handler.userHandler = (reqProp, callBack) => {

    const fireMethod = ['get', 'post', 'put', 'delete'];
    if (fireMethod.indexOf(reqProp.method) < 0) return callBack(405);
    //send users scaffolding the firing method.
    handler._users[reqProp.method](reqProp, callBack);
}

//for user scaffolding
handler._users = {};

//ROUTE 1: Get Users Details:  GET "/user?phone=number". Login required
handler._users.get = (reqProp, callBack) => {
    const query = typeof (reqProp.queryStringObject.phone) === 'string' && reqProp.queryStringObject.phone.length === 11 ? reqProp.queryStringObject.phone : null;

    const token = typeof (reqProp.headerObject.token) === 'string' && reqProp.headerObject.token.length === 20 ? reqProp.headerObject.token : null;

    if (!query && !token) { return callBack(400, { error: "Bad Request!" }); }

    tokenHandler._token.verify(token, query, (err) => {

        if (!err) { return callBack(500, { err: "Unable to validate!" }) };

        //Get the user
        data.read('users', query, (err, u) => {
            const user = parseJson(u);
            if (err && !u) { return callBack(404, { error: "The user not exist!" }); }
            delete user.pwd;
            callBack(200, user);
        });

    });

};

//ROUTE 2: POST To Add User:  POST "/user". NO Login required
handler._users.post = (reqProp, callBack) => {

    const fName = typeof (reqProp.body.fName) === "string" && reqProp.body.fName.length > 0 ? reqProp.body.fName : null;
    const lName = typeof (reqProp.body.lName) === 'string' && reqProp.body.lName.length > 0 ? reqProp.body.lName : null;
    const phoneNumber = typeof (reqProp.body.phone) === 'string' && reqProp.body.phone.length === 11 ? reqProp.body.phone : null;
    const pwd = typeof (reqProp.body.pwd) === 'string' && reqProp.body.pwd.length > 0 ? reqProp.body.pwd : null;
    const bob = typeof (reqProp.body.bob) === 'string' && reqProp.body.bob.length > 0 ? reqProp.body.bob : null;
    const policy = typeof (reqProp.body.policy) === 'boolean' ? reqProp.body.policy : null;

    if (!fName && !lName && !phoneNumber && !pwd && !bob && !policy) { return callBack(400, { error: "Bad Request!" }); }

    //check user existence
    data.read('users', phoneNumber, (err, user) => {
        if (!err && user) { return callBack(404, { error: "The user exist!" }); }

        //Adding user
        let dataObject = {
            fName,
            lName,
            phoneNumber,
            pwd: hash(pwd),
            bob,
            policy
        }
        //send data to file
        data.create('users', phoneNumber, dataObject, (error) => {
            if (error) { return callBack(500, { error: "Server is down!" }); }
            callBack(200, { message: "Welcome! To  our world. " })
        });


    });


};

//ROUTE 3: PUT To Update the User Details:  POST "/user".Login required
handler._users.put = (reqProp, callBack) => {
    //key for query
    const query = typeof (reqProp.body.phone) === 'string' && reqProp.body.phone.length === 11 ? reqProp.body.phone : null;


    const token = typeof (reqProp.headerObject.token) === 'string' && reqProp.headerObject.token.length === 20 ? reqProp.headerObject.token : null;

    if (!query && !token) { return callBack(500, { error: "User Auth not found!" }); }

    tokenHandler._token.verify(token, query, (err) => {

        if (!err) { return callBack(500, { err: "Unable to validate!" }) };
        //data need to update
        const fName = typeof (reqProp.body.fName) === "string" && reqProp.body.fName.length > 0 ? reqProp.body.fName : null;
        const lName = typeof (reqProp.body.lName) === 'string' && reqProp.body.lName.length > 0 ? reqProp.body.lName : null;
        const pwd = typeof (reqProp.body.pwd) === 'string' && reqProp.body.pwd.length > 0 ? reqProp.body.pwd : null;
        const bob = typeof (reqProp.body.bob) === 'string' && reqProp.body.bob.length > 0 ? reqProp.body.bob : null;

        if (!fName && !lName && !pwd && !bob) { return callBack(500, { error: "Bad Request!" }); }
        //Get the user
        data.read('users', query, (err, u) => {

            const user = parseJson(u);

            if (err && !u) { return callBack(404, { error: "The user not exist!" }); }
            if (fName) { user.fName = fName; }
            if (lName) { user.lName = lName; }
            if (pwd) { user.pwd = hash(pwd); }
            if (bob) { user.bob = bob; }

            //update the file
            data.update('users', query, user, (err) => {
                if (err) { return callBack(404, { error: "Unable to update user file" }); }

                callBack(200, { message: "You got new update!" });
            });
        });
    });
};

//ROUTE 3: Delete The User Details:  POST "/user".Login required
handler._users.delete = (reqProp, callBack) => {
    //key for query
    const query = typeof (reqProp.body.phone) === 'string' && reqProp.body.phone.length === 11 ? reqProp.body.phone : null;

    const token = typeof (reqProp.headerObject.token) === 'string' && reqProp.headerObject.token.length === 20 ? reqProp.headerObject.token : null;
    if (!query && !token) { return callBack(500, { error: "User Auth not found!" }); }

    tokenHandler._token.verify(token, query, (err) => {
        data.delete('users', query, (err) => {
            if (err) { return callBack(404, { error: "The user not exist!" }); }
            callBack(200, { message: "Opps! We will miss you." })
        });
    });
};


module.exports = handler;