// dependences
const http = require("http");
const handle = require('./helpers/HelperReqRes');

// object -> module scaffolding
const app = {};

// object for config
app.config = {
    port: 3000,
};

// server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log("Listening on port http://localhost:" + app.config.port);
    });
};

// handle request & response
app.handleReqRes = handle;

// server call
app.createServer();
