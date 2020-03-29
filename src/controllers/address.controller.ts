'use strict';
import { NextFunction, Request, Response } from 'express';
import { PipelineValidation } from '../shared/validations';
import { addressSizes as addrSize } from '../shared/fieldSize';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { tokenService as tokenS } from '../services/tokenService';
import { Address, AddressAdd } from '../domain/interfaces/address.interface';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { AddressSchema } from '../data/schemas/address.schema';
import { ObjectId } from 'bson';
import { TokenData } from '../services/interfaces/tokenData.interface';

const entityName = 'Endereço';

function validateAddress(addr: Address | AddressAdd): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atMaxLen('Cidade', addr.city, addrSize.cityMax, msg.maxLen)
      .atMaxLen('Bairro', addr.neighborhood, addrSize.neighborhoodMax, msg.maxLen)
      .atMaxValue('Número', addr.number, addrSize.numberMax, msg.maxValue)
      .atMaxLen('Estado', addr.state, addrSize.stateMax, msg.maxLen)
      .atMaxLen('Logradouro', addr.street, addrSize.streetMax, msg.maxLen)
      .validCEP('CEP', addr.zipCode, msg.invalidFormat);
}

/*TODO: Check Owner*/
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

async function getById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    return await ctrlFunc.getById<Address>(
      req, res, next, entityName,
      (id) => repoFunc.findById(id, AddressSchema)
    );
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const data: TokenData = tokenS.decodeFromReq(req);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await ctrlFunc.post<AddressAdd>(
      req, res, next,
      (obj: AddressAdd) => repoFunc.create({ ...obj, userId: data.id }, AddressSchema),
      validateAddress
    );
}

/*TODO: Criar e testar Patchs*/

export const addressController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post
};
