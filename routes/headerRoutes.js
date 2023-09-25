
const { sampleHandler } = require('../handler/routesHandlers/SampleHandler');
const { userHandler } = require('../handler/routesHandlers/userHandler');
const { tokenHandler } = require('../handler/routesHandlers/tokenHandler');
const { checkHandler } = require('../handler/routesHandlers/checkHandler');

const router = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHandler,
}
module.exports = router;