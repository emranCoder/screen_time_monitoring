const NotFoundError = (reqProper, callBack) => {
    console.log(reqProper);
    callBack(404, {
        message: "Something bad happend..",
    });
}

module.exports = NotFoundError;