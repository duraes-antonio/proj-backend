'use strict';
import { FilterBasic } from '../domain/models/filters/filterBasic.interface';
import { Link, LinkAdd } from '../domain/models/link';
import { List } from '../domain/models/lists/list';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { listService } from '../services/list.service';
import { ListLinkSchema } from '../data/schemas/list-link.schema';

export const entityName = 'Lista de Links';

async function delete_(req: Request, res: Response, next: NextFunction): Promise<Response> {
    return ctrlFunc.delete<List<Link>>(req, res, next, entityName,
      (id) => repoFunc.delete(id, ListLinkSchema)
    );
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await ctrlFunc.post<List<LinkAdd>>(
      req, res, next,
      () => repoFunc.create(req.body, ListLinkSchema),
      listService.validateListAdd
    );
}

async function get(req: Request, res: Response, next: NextFunction): Promise<Response<List<Link>[]>> {
    return ctrlFunc.get<List<Link>>(
      req, res, next,
      () => repoFunc.find(ListLinkSchema, req.body as FilterBasic)
    );
}

async function getById(req: Request, res: Response, next: NextFunction): Promise<Response<List<Link>>> {
    return ctrlFunc.getById<List<Link>>(
      req, res, next, entityName,
      () => repoFunc.findById(req.params.id, ListLinkSchema)
    );
}

async function patch(req: Request, res: Response, next: NextFunction): Promise<Response<List<Link>>> {
    return ctrlFunc.patch<List<Link>>(
      req, res, next, entityName, listService.validateListAdd,
      (id, obj) => repoFunc.findAndUpdate(id, obj, ListLinkSchema, {}),
      ['title', 'readRole', 'itemsId']
    );
}

export const listLinkController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    patch: patch
};
