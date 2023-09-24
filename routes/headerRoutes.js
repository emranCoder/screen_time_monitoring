
const { sampleHandler } = require('../handler/routesHandlers/SampleHandler');
const { userHandler } = require('../handler/routesHandlers/userHandler');
const { tokenHandler } = require('../handler/routesHandlers/tokenHandler');

const router = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler
}
module.exports = router;