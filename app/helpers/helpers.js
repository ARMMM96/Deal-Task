class Herlper {
    static responseHandler = (res, statusCode, apiStatus, data, message) => {
        res.status(statusCode).send({
            apiStatus,
            data,
            message,
        });
    };
}
module.exports = Herlper;
