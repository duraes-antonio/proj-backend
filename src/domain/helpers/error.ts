import { serviceDataMsg as msgServ } from '../../shared/buildMsg';
import { ItemStock } from '../../controllers/base/response.functions';

export class ErrorGeneric extends Error {
    readonly code: number;

    constructor(code: number, message?: string) {
        super(message);
        this.code = code;
    }
}

export class BadRequestError extends ErrorGeneric {
    readonly messages: string[];

    constructor(messages: string[]) {
        super(400);
        this.messages = messages;
    }
}

export class DuplicatedError extends ErrorGeneric {

    constructor(entityName: string, propUnique: string, propValue: string) {
        super(409, msgServ.duplicate(entityName, propUnique, propValue).message);
    }
}

export class EmptyTokenError extends ErrorGeneric {
    constructor() {
        super(401, msgServ.tokenEmpty().message);
    }
}

export class ExpiredTokenError extends ErrorGeneric {
    constructor() {
        super(401, msgServ.tokenExpired().message);
    }
}

export class ForbiddenError extends ErrorGeneric {

    constructor(entityName: string, propUnique: string, propValue: string) {
        super(403, msgServ.deniedAccessItem().message);
    }
}

export class InvalidFieldError extends ErrorGeneric {

    constructor(fields: string[]) {
        super(400, msgServ.fieldsInvalid(fields).message);
    }
}

export class InvalidIdError extends ErrorGeneric {

    constructor(id: string) {
        super(400, msgServ.invalidId(id).message);
    }
}

export class InvalidTokenError extends ErrorGeneric {
    constructor() {
        super(401, msgServ.tokenInvalid().message);
    }
}

export class NotEnoughStockError extends ErrorGeneric {

    constructor(stockInfo: ItemStock[]) {
        super(400, msgServ.notEnoughStock(stockInfo).message);
    }
}

export class NotFoundError extends ErrorGeneric {

    constructor(entityName: string, propUnique: string, propValue: string) {
        super(404, msgServ.notFound(entityName, propUnique, propValue).message);
    }
}

export class NotFoundManyError extends ErrorGeneric {

    constructor(entityName: string, propUnique: string, propValues: string[] | number[]) {
        super(404, msgServ.notFoundMany(entityName, propUnique, propValues).message);
    }
}

export class UnknownError extends ErrorGeneric {
    code = 500;
    message = msgServ.unknown().message;
    data?: object;

    constructor(data?: object) {
        super(500);
        this.data = data;
    }
}
