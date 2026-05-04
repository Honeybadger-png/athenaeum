export abstract class BaseError extends Error {
    abstract readonly statusCode: number;


    constructor(message: string | undefined){
        super(message);
        Object.setPrototypeOf(this,new.target.prototype);
        Error.captureStackTrace(this,this.constructor);
    }
}


export class UnauthorizedError extends BaseError {
    statusCode = 401;
    constructor(message="Invalid email or password"){
        super(message)
    }
}

export class ValidationError extends BaseError {
    statusCode = 422;
    constructor(message="Validation Failed"){
        super(message)
    }
}

export class ConflictError extends BaseError {
    statusCode = 409;
    constructor(message = "Conflict Occured"){
        super(message)
    }
}

export class InternalError extends BaseError{
    statusCode = 500
    constructor(message = "Internal Error"){
        super(message)
    }
}