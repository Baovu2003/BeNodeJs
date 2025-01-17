"use strict";

const StatusCode = {
    OK: 200200,
    CREATED: 201,
};

const ReasonStatusCode = {
    CREATED: "CREATED",
    OK: "SUCCESS",
};

class SuccessResponse  {
    constructor(message, statusCode = StatusCode.OK,reasonStatusCode = ReasonStatusCode.OK,metadata={} ) {
       
        this.message = !message ? reasonStatusCode : message  ;
        this.status = statusCode
        this.metadata = metadata
    }
    send(res,headers = {}) {
        return res.status(this.status).json(this);
    }
};

class OK extends SuccessResponse {
    constructor(message, metadata = {}) {
        super(message, StatusCode.OK, ReasonStatusCode.OK, metadata);
    }
}

module.exports ={
    ConflictRequestError,
    BadRequestError,
}
