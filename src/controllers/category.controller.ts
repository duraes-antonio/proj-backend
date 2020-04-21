'use strict';
import { Category, CategoryAdd } from '../domain/models/category';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { categoryRepository as categRepo } from '../data/repository/category.repository';
import { FilterCategory } from '../domain/models/filters/filter-category';
import { CategorySchema } from '../data/schemas/category.schema';
import { categoryService } from '../services/category.service';
import { responseFunctions } from './base/response.functions';

export const entityName = 'Categoria';

async function delete_(req: Request, res: Response, next: NextFunction): Promise<Response> {
    return ctrlFunc.delete<Category>(req, res, next, entityName,
      (id) => repoFunc.delete(id, CategorySchema)
    );
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await ctrlFunc.post<CategoryAdd>(
      req, res, next,
      () => repoFunc.create(req.body, CategorySchema),
      categoryService.validate
    );
}

async function get(req: Request, res: Response, next: NextFunction): Promise<Response<Category[]>> {
    return ctrlFunc.get<Category>(
      req, res, next, () => categRepo.find(req.body as FilterCategory)
    );
}

async function getCount(req: Request, res: Response, next: NextFunction): Promise<Response<number>> {
    const filter = req.query && Object.keys(req.query).length ? req.query : req.body;
    return responseFunctions.success(res, await categRepo.findCount(filter));
}

async function getById(req: Request, res: Response, next: NextFunction): Promise<Response<Category>> {
    return ctrlFunc.getById<Category>(
      req, res, next, entityName,
      () => repoFunc.findById(req.params.id, CategorySchema)
    );
}

async function patch(req: Request, res: Response, next: NextFunction): Promise<Response<Category>> {
    return ctrlFunc.patch<Category>(
      req, res, next, entityName, categoryService.validate,
      (id, obj) => repoFunc.findAndUpdate(id, obj, CategorySchema),
      ['title']
    );
}

export const categoryController = {
    delete: delete_,
    get,
    getCount,
    getById,
    post,
    patch
};
