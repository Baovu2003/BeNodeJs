"use strict";


const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409,
};

const reasonStatusCode = {
    FORBIDDEN: "Bad request ",
    CONFLICT: "Conflict error",
};

class ErrorResponse extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
};


class ConflictRequestError extends ErrorResponse {
    constructor(message = reasonStatusCode.CONFLICT, statusCode= StatusCode.CONFLICT) {
        super(message, statusCode);
    }
}
class BadRequestError extends ErrorResponse{
    constructor(message = reasonStatusCode.FORBIDDEN, statusCode= StatusCode.FORBIDDEN) {
        super(message, statusCode);
    }
}
module.exports ={
    ConflictRequestError,
    BadRequestError,
}
