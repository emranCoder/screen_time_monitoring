// dependences
const http = require("http");
const handle = require('./helpers/HelperReqRes');
const environment = require('./helpers/environment');
const data = require('./library/data');

//data folding
data.read('test', 'fileName', (result) => {

    console.log(JSON.parse('[' + result + ']').filter(data => data["id"] == "221-115-118"));
})

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
