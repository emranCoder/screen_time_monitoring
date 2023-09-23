
const { sampleHandler } = require('../handler/routesHandlers/SampleHandler');
const { userHandler } = require('../handler/routesHandlers/userHandler');

const router = {
    sample: sampleHandler,
    user: userHandler,
}
module.exports = router;