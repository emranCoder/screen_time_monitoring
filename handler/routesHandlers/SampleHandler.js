const handler = {};
handler.sampleHandler = (reqData, callBack) => {
    //console.log(reqData);
    callBack(200, {
        message: "From Sample Handler",
    });
}
module.exports = handler;