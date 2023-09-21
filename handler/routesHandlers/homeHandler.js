const handler = {};

handler.homeHanlder = (reqData, callBack) => {
    callBack(200, {
        'message': "This is Home"
    })
}
module.exports = handler;