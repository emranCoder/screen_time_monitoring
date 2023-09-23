const url = require("url");
const { StringDecoder } = require('node:string_decoder');
const routes = require('../routes/headerRoutes');
const NotFoundError = require('../handler/routesHandlers/NotFoundError');
const { parseJson } = require('../helpers/utilities');

const handle = (req, res) => {

    const parseUrl = url.parse(req.url, true);
    const path = parseUrl.pathname;
    const trimPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();

    //get query
    const queryStringObject = parseUrl.query;

    //Post method - header object 
    const headerObject = req.headers;

    //Post method-- body data collect
    const reqProperties = {
        parseUrl,
        path,
        trimPath,
        method,
        queryStringObject,
        headerObject
    };
    const getHandler = routes[trimPath] ? routes[trimPath] : NotFoundError;

    const decoder = new StringDecoder('utf-8');
    let rawData = '';

    req.on('data', (buffer) => {
        rawData += decoder.write(buffer);
    })

    req.on('end', () => {
        rawData += decoder.end();

        reqProperties.body = parseJson(rawData);

        getHandler(reqProperties, (statusCode, payload) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            payload = typeof (payload) === 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);
            //return the final response
            res.setHeader('Content-Type', 'application/json')
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    })
};

module.exports = handle;