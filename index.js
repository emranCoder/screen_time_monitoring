// dependence
const http = require("http");
const handle = require('./helpers/HelperReqRes');
const environment = require('./helpers/environment');
const data = require('./library/data');


// object -> module scaffolding
const app = {};


// server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log("Listening on port http://localhost:" + environment.port);
    });
};

// handle request & response
app.handleReqRes = handle;

// server call
app.createServer();
