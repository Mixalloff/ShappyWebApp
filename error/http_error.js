'use strict';
var http = require('http');

class HttpError extends Error {

    constructor(status,message,type) {
        super();
        Error.apply(this,arguments);
        Error.captureStackTrace(this, HttpError);
        this.status = status;
        this.message = message || http.STATUS_CODES[status] || "Error";
        this.type = type || 'notype';
    }

    static ConvertError(err) {
        return new HttpError(err.status,err.data,err.type);
    }
}
module.exports = HttpError;