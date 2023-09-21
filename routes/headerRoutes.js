
const { sampleHandler } = require('../handler/routesHandlers/SampleHandler');
const { homeHanlder } = require('../handler/routesHandlers/homeHandler');

const router = {
    sample: sampleHandler,
    home: homeHanlder,
}
module.exports = router;