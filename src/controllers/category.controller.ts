'use strict';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { Category, CategoryAdd } from '../domain/interfaces/category.interface';
import { categorySizes } from '../shared/fieldSize';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { categoryRepository as categRepo } from '../data/repository/category.repository';
import { FilterCategory } from '../domain/models/filters/filterCategory.model';
import { CategorySchema } from '../data/schemas/category.schema';

export const entityName = 'Categoria';

function validateCategory(cat: Category | CategoryAdd): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atMaxLen('Título', cat.title, categorySizes.titleMax, msg.maxLen);
}

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
      validateCategory
    );
}

async function get(
  req: Request, res: Response, next: NextFunction
): Promise<Response<Category[]>> {
    return ctrlFunc.get<Category>(
      req, res, next,
      () => categRepo.find(req.body as FilterCategory)
    );
}

async function getById(
  req: Request, res: Response, next: NextFunction
): Promise<Response<Category>> {
    return ctrlFunc.getById<Category>(
      req, res, next, entityName,
      () => repoFunc.findById(req.params.id, CategorySchema)
    );
}

/*TODO: Converter para patch*/
async function put(req: Request, res: Response, next: NextFunction) {
    const putObj = { title: req.body.title };
    return ctrlFunc.put<Category>(
      req, res, next, entityName, putObj, validateCategory,
      (id, obj) => repoFunc.update(id, obj, CategorySchema)
    );
}

export const categoryController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    put: put
};
