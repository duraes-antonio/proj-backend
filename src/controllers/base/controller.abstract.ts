'use strict';

import { NextFunction, Request, Response } from 'express';
import { responseFunctions as resFunc } from './responseFunctions';
import { PipelineValidation } from '../../shared/validations';
import { IFilterBasic } from '../../domain/interfaces/filters/filterBasic.interface';

function validIdHex(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

async function delete_<T>(
  req: Request, res: Response, next: NextFunction, entity: string,
  bdDelete: (id: string) => Promise<T | null>
) {
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
  bdFind: (filter: IFilterBasic) => Promise<T[]>
) {
    try {
        const objs: T[] = await bdFind(req.query);
        return resFunc.success(res, objs);
    } catch (err) {
        return resFunc.unknown(res, err);
    }
}

async function getById<T>(
  req: Request, res: Response, next: NextFunction, entity: string,
  bdFind: (id: string) => Promise<T | null>
) {
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

async function post<T>(
  req: Request, res: Response, next: NextFunction,
  bdCreate: (payload: T) => Promise<T>,
  fnValidate?: (obj: T) => PipelineValidation,
  fnPosCreate?: (objSaved: T) => void
) {
    if (fnValidate) {
        const pipe = fnValidate(req.body);

        if (!pipe.valid) {
            return resFunc.badRequest(res, pipe.errors);
        }
    }

    try {
        const objSaved = await bdCreate({ ...req.body });

        if (fnPosCreate) {
            return fnPosCreate(objSaved);
        } else {
            return resFunc.created(res, objSaved);
        }

    } catch (err) {
        return resFunc.unknown(res, err);
    }
}

async function put<T>(
  req: Request, res: Response, next: NextFunction, entity: string,
  fnValidate: (obj: T) => PipelineValidation,
  bdUpdate: (id: string, payload: T) => Promise<T | null>
) {

    try {
        if (!validIdHex(req.params.id)) {
            return resFunc.invalidId(res, req.params.id);
        }

        const pipe = fnValidate(req.body);

        if (!pipe.valid) {
            return resFunc.badRequest(res, pipe.errors);
        }

        const objUpdated = await bdUpdate(req.params.id, req.body);

        if (!objUpdated) {
            return resFunc.notFound(res, entity, 'id', req.params.id);
        }

        return resFunc.success(res);
    } catch (err) {
        return resFunc.unknown(res, err);
    }
}

export const controllerFunctions = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    put: put
};
