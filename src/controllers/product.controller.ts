'use strict';
import { NextFunction, Request, Response } from 'express';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { IProduct } from '../domain/interfaces/product.interface';
import { productSizes as prodSizes } from '../shared/fieldSize';
import { controllerFunctions as ctrlFunc } from './base/controller.abstract';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { Product } from '../data/schemas/product.schema';

export const entityName = 'Produto';

function validateProduct(prod: IProduct): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atMaxLen('Título', prod.title, prodSizes.titleMax, msg.maxLen)
      .atMaxLen('Descrição', prod.title, prodSizes.titleMax, msg.maxLen)
      .atMaxValue('Preço', prod.price, prodSizes.priceMax, msg.maxValue)
      .atLeastValue('Preço', prod.price, prodSizes.priceMin, msg.minValue)

      .atLeastValue('Desconto', prod.percentOff, prodSizes.percentOffMin, msg.minValue)
      .atMaxValue('Desconto', prod.percentOff, prodSizes.percentOffMax, msg.maxValue)

      .atLeastValue('Quantidade disponível', prod.amountAvailable, prodSizes.amountAvailableMin, msg.minValue)
      .atMaxValue('Quantidade disponível', prod.amountAvailable, prodSizes.amountAvailableMax, msg.maxValue)
      ;
}

async function delete_(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.delete(req, res, next,
      (id) => repoFunc.delete(id, Product)
    );
}

async function post(req: Request, res: Response, next: NextFunction) {
    return await ctrlFunc.post<IProduct>(
      req, res, next,
      () => repoFunc.create(req.body, Product),
      validateProduct
    );
}

async function get(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.get<IProduct>(
      req, res, next,
      ({}) => repoFunc.find(Product)
    );
}

async function getById(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.getById<IProduct>(
      req, res, next,
      (id) => repoFunc.findById(req.params.id, Product)
    );
}

async function put(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.put<IProduct>(
      req, res, next, validateProduct,
      (id, obj) => repoFunc.update(id, obj, Product)
    );
}

export const productController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    put: put
};
