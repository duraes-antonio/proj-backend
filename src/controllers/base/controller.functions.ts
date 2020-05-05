'use strict';
import { NextFunction, Request, Response } from 'express';
import { responseFunctions as resFunc } from './response.functions';
import { PipelineValidation } from '../../shared/validations';
import { FilterBasic } from '../../domain/models/filters/filter-basic';

function validIdHex(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

async function delete_<T>(
  req: Request, res: Response, next: NextFunction, entity: string,
  bdDelete: (id: string) => Promise<T | null>
): Promise<Response> {
    try {
        if (!validIdHex(req.params.id)) {
            return resFunc.invalidId(res, req.params.id);
        }

        const objDeleted = await bdDelete(req.params.id);

        if (!objDeleted) {
            return resFunc.notFound(res, entity, 'id', req.params.id);
        }

        return resFunc.success(res);
    } catch (err) {
        return resFunc.unknown(res, err);
    }
}

async function get<T>(
  req: Request, res: Response, next: NextFunction,
  bdFind: (filter: FilterBasic) => Promise<T[]>
): Promise<Response<T[]>> {
    try {
        const filterQuery = req.query.filter ? JSON.parse(req.query.filter) : req.query;
        const filter = Object.keys(filterQuery).length ? filterQuery : {};
        const objs: T[] = await bdFind(filter);
        return resFunc.success(res, objs);
    } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return resFunc.unknown(res, err);
    }
}

async function getById<T>(
  req: Request, res: Response, next: NextFunction, entity: string,
  bdFind: (id: string) => Promise<T | null>
): Promise<Response> {
    if (!validIdHex(req.params.id)) {
        return resFunc.invalidId(res, req.params.id);
    }

    try {
        const obj = await bdFind(req.params.id);

        if (!obj) {
            return resFunc.notFound(res, entity, 'id', req.params.id);
        }
        return resFunc.success(res, obj);
    } catch (err) {
        return resFunc.unknown(res, err);
    }
}

async function patch<T>(
  req: Request, res: Response, next: NextFunction,
  entity: string, fnValidate: (obj: T) => PipelineValidation,
  bdUpdate: (id: string, payload: T) => Promise<T | null>, allowFields: string[]
): Promise<Response> {

    try {
        if (!validIdHex(req.params.id)) {
            return resFunc.invalidId(res, req.params.id);
        }

        const patchObj = req.body;
        const invalidNameFields: string[] = Object.keys(patchObj)
          .filter(key =>
            !allowFields.some(fieldName => fieldName.toLowerCase() === key.toLowerCase())
          );

        if (invalidNameFields.length) {
            return resFunc.invalidFieldsPatch(res, invalidNameFields);
        }

        const pipeline = fnValidate(patchObj);

        if (!pipeline.valid) {
            return resFunc.badRequest(res, pipeline.errors);
        }

        const objUpdated = await bdUpdate(req.params.id, patchObj);

        if (!objUpdated) {
            return resFunc.notFound(res, entity, 'id', req.params.id);
        }

        return resFunc.success(res, objUpdated);
    } catch (err) {
        return resFunc.unknown(res, err);
    }
}

async function postGeneric<T>(
  req: Request, res: Response, next: NextFunction,
  bdCreate: (payload: T) => Promise<T>,
  fnValidate?: (obj: T) => PipelineValidation,
  sendPosCreate = true
): Promise<Response | T> {
    if (fnValidate) {
        const pipe = fnValidate(req.body);

        if (!pipe.valid) {
            return resFunc.badRequest(res, pipe.errors);
        }
    }

    try {
        const objSaved = await bdCreate({ ...req.body });

        if (!sendPosCreate) {
            return objSaved;
        } else {
            return resFunc.created(res, objSaved);
        }

    } catch (err) {
        return resFunc.unknown(res, err);
    }
}

async function post<T>(
  req: Request, res: Response, next: NextFunction,
  bdCreate: (payload: T) => Promise<T>,
  fnValidate?: (obj: T) => PipelineValidation
): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await postGeneric<T>(req, res, next, bdCreate, fnValidate);
}

async function postAndReturnCreated<T>(
  req: Request, res: Response, next: NextFunction,
  bdCreate: (payload: T) => Promise<T>,
  fnValidate?: (obj: T) => PipelineValidation
): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await postGeneric<T>(req, res, next, bdCreate, fnValidate, false);
}

export const controllerFunctions = {
    delete: delete_,
    get,
    getById,
    patch,
    post,
    postAndReturnCreated
};
