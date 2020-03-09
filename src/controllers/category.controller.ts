'use strict';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { ICategory } from '../domain/interfaces/category.interface';
import { categorySizes } from '../shared/fieldSize';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.abstract';
import { Category } from '../data/schemas/category.schema';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { categoryRepository as categRepo } from '../data/repository/category.repository';
import { FilterCategory } from '../domain/models/filters/filterCategory.model';

export const entityName = 'Categoria';

function validateCategory(cat: ICategory): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atMaxLen('Título', cat.title, categorySizes.titleMax, msg.maxLen);
}

async function delete_(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.delete(req, res, next, entityName,
      (id) => repoFunc.delete(id, Category)
    );
}

async function post(req: Request, res: Response, next: NextFunction) {
    return await ctrlFunc.post<ICategory>(
      req, res, next,
      () => repoFunc.create(req.body, Category),
      validateCategory
    );
}

async function get(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.get<ICategory>(
      req, res, next,
      () => categRepo.find(req.query as FilterCategory)
    );
}

async function getById(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.getById<ICategory>(
      req, res, next, entityName,
      () => repoFunc.findById(req.params.id, Category)
    );
}

async function put(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.put<ICategory>(
      req, res, next, entityName, validateCategory,
      (id, obj) => repoFunc.update(id, obj, Category)
    );
}

export const categoryController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    put: put
};
