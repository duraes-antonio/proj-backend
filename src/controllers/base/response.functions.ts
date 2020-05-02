import { Response } from 'express';
import { serviceDataMsg as msgS } from '../../shared/buildMsg';
import { TypeMessage } from '../../domain/enum/type-message';

export interface Message {
    message: string;
    type?: TypeMessage;
}

export interface ItemStock {
    productName: string;
    quantityAvailable: number;
}

function badRequest(res: Response, errors: string[]): Response<string[]> {
    return res.status(400).send(errors);
}

function created<T>(res: Response, data: T): Response<T> {
    return res.status(201).send(data);
}

function duplicated(
  res: Response, entity: string, propName: string, propVal: string
): Response<Message> {
    return res.status(409).send(msgS.duplicate(entity, propName, propVal));
}

function forbidden(res: Response): Response<Message> {
    return res.status(403).send(msgS.deniedAccessItem());
}

function invalidFieldsPatch(res: Response, fields: string[]): Response<string[]> {
    return res.status(400).send(msgS.fieldsInvalid(fields));
}

function invalidId(res: Response, id: string): Response<Message> {
    return res.status(400).send(msgS.invalidId(id));
}

function notEnoughStock(res: Response, stockInfo: ItemStock[]): Response<Message> {
    return res.status(400).send(msgS.notEnoughStock(stockInfo));
}

function notFound(
  res: Response, entity: string, propName: string, propVal: string | number
): Response<Message> {
    return res.status(404).send(msgS.notFound(entity, propName, propVal));
}

function notFoundMany(
  res: Response, entity: string, propName: string, propVal: string[] | number[]
): Response<Message> {
    return res.status(404).send(msgS.notFoundMany(entity, propName, propVal));
}

function success<T>(res: Response, data?: T): Response<T> {
    const dataReturn = !data ? '' : (data instanceof Object ? data : { data });
    return res.status(200).send(dataReturn);
}

function unknown(res: Response, err: Error):
  Response<{ message: string; data: Error }> {
    return res.status(500).send({ ...msgS.unknown(), data: err });
}

export const responseFunctions = {
    badRequest: badRequest,
    created: created,
    duplicated: duplicated,
    forbidden: forbidden,
    invalidFieldsPatch: invalidFieldsPatch,
    invalidId: invalidId,
    notEnoughStock,
    notFound: notFound,
    notFoundMany,
    success: success,
    unknown: unknown
};
