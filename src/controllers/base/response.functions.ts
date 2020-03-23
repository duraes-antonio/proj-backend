import { Response } from 'express';
import { serviceDataMsg as msgS } from '../../shared/buildMsg';

function badRequest(res: Response, errors: string[]) {
    return res.status(400).send(errors);
}

function created(res: Response, data: any) {
    return res.status(201).send(data);
}

function duplicated(res: Response, entity: string, propName: string, propVal: string) {
    return res.status(409).send(msgS.duplicate(entity, propName, propVal));
}

function invalidId(res: Response, id: string) {
    return res.status(400).send(msgS.invalidId(id));
}

function notFound(res: Response, entity: string, propName: string, propVal: string | number) {
    return res.status(404).send(msgS.notFound(entity, propName, propVal));
}

function success(res: Response, data?: any) {
    return res.status(200).send(data ? data : '');
}

function unknown(res: Response, err: any) {
    return res.status(500).send({ ...msgS.unknown(), data: err });
}

export const responseFunctions = {
    badRequest: badRequest,
    created: created,
    duplicated: duplicated,
    invalidId: invalidId,
    notFound: notFound,
    success: success,
    unknown: unknown
};
