'use strict';
import { NextFunction, Request, Response } from 'express';
import { tokenService as tokenS } from '../services/token.service';
import { Address, AddressAdd } from '../domain/models/address';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { AddressSchema } from '../data/schemas/address.schema';
import { ObjectId } from 'bson';
import { addressService } from '../services/address.service';
import { User } from '../domain/models/user';

const entityName = 'Endereço';

async function delete_(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const data = tokenS.decodeFromReq(req);
    return await ctrlFunc.delete<Address>(req, res, next, entityName,
      (id) => repoFunc.delete(id, AddressSchema, { userId: data.id })
    );
}

async function get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const tokenData = tokenS.decodeFromReq(req);
    return await ctrlFunc.get<Address>(
      req, res, next,
      () => repoFunc.find(
        AddressSchema,
        undefined,
        undefined,
        { userId: new ObjectId(tokenData.id) }
      )
    );
}

async function getById(req: Request, res: Response, next: NextFunction): Promise<Response<Address>> {
    return await ctrlFunc.getById<Address>(
      req, res, next, entityName,
      (id) => repoFunc.findById(id, AddressSchema)
    );
}

async function patch(req: Request, res: Response, next: NextFunction): Promise<Response<Address>> {
    const data: User = tokenS.decodeFromReq(req);
    return await ctrlFunc.patch<AddressAdd>(
      req, res, next, entityName,
      (obj) => addressService.validate(obj, true),
      (id: string, obj: AddressAdd) => repoFunc.findAndUpdate(
        id, { ...obj, userId: data.id }, AddressSchema, { userId: data.id }
      ),
      ['number', 'zipcode', 'street', 'neighborhood', 'city', 'state']
    );
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response<Address>> {
    const data: User = tokenS.decodeFromReq(req);
    return await ctrlFunc.post<AddressAdd>(
      req, res, next,
      (obj: AddressAdd) =>
        repoFunc.create({ ...obj, userId: data.id }, AddressSchema),
      addressService.validate
    );
}

export const addressController = {
    delete: delete_,
    get: get,
    getById: getById,
    patch: patch,
    post: post
};
