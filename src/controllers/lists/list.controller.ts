'use strict';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from '../base/controller.functions';
import { repositoryFunctions as repoFunc } from '../../data/repository.functions';
import { listService } from '../../services/list.service';
import { List, ListAdd } from '../../domain/models/lists/list';
import { Document, Model } from 'mongoose';

async function delete_<T>(
  req: Request, res: Response, next: NextFunction, entityName: string,
  schema: Model<Document & T>
): Promise<Response> {
    return ctrlFunc.delete(req, res, next, entityName,
      (id) => repoFunc.delete(id, schema)
    );
}

async function post<T>(
  req: Request, res: Response, next: NextFunction, entityName: string,
  schema: Model<Document & T>
): Promise<Response> {
    return await ctrlFunc.post<ListAdd<T>>(
      req, res, next, () => repoFunc.create(req.body, schema),
      listService.validateListAdd
    );
}

async function get<T>(
  req: Request, res: Response, next: NextFunction, entityName: string,
  schema: Model<Document & List<T>>
): Promise<Response<List<T>[]>> {
    return ctrlFunc.get<List<T>>(
      req, res, next,
      () => repoFunc.find<List<T>>(
        schema, req.body, undefined, undefined, 'items'
      )
    );
}

async function getById<T>(
  req: Request, res: Response, next: NextFunction, entityName: string,
  schema: Model<Document & List<T>>
): Promise<Response<List<T>>> {
    return ctrlFunc.getById<List<T>>(
      req, res, next, entityName,
      () => repoFunc.findById(req.params.id, schema, 'items')
    );
}

async function patch<T>(
  req: Request, res: Response, next: NextFunction, entityName: string,
  schema: Model<Document & List<T>>
): Promise<Response<List<T>>> {
    return ctrlFunc.patch<List<T>>(
      req, res, next, entityName,
      (list) => listService.validateListAdd(list, true),
      (id, obj) =>
        repoFunc.findAndUpdate(id, obj, schema, {}),
      ['title', 'readRole', 'itemsId']
    );
}

export const listController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    patch: patch
};
