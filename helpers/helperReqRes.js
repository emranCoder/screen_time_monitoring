const http = require("http");
const path = require("path");
const url = require("url");
const { StringDecoder } = require('node:string_decoder');
const router = require('../routes/headerRoutes');
const NotFoundError = require('../handler/routesHandlers/NotFoundError');

const handle = (req, res) => {

    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimPath = path.replace(/^\/+|\/+$/g, '');
    const endUrl = trimPath.toLowerCase();

    //get query
    const queryStringObjct = parseUrl.query;

    //Post method - header object 
    const headerObject = req.headers;


    //Post method-- body data collect

    const reqPropertices = {
        parseUrl,
        path,
        trimPath,
        endUrl,
        queryStringObjct,
        headerObject
    };
    const getHandler = router[trimPath] ? router[trimPath] : NotFoundError;

    getHandler(reqPropertices, (statusCode, payload) => {
        statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
        payload = typeof (payload) === 'object' ? payload : {};

        const payloadString = JSON.stringify(payload);

        //return the final response
        res.writeHead(statusCode);
        res.end(payloadString);

    });

    const decoder = new StringDecoder('utf-8');
    let rawData = {};

    req.on('data', (buffer) => {
        rawData += decoder.write(buffer);
    })

    req.on('end', () => {
        rawData += decoder.end();
        console.log(rawData);

        res.end("Your Datas...");
    })
};

module.exports = handle;