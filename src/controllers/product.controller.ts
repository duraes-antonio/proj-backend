'use strict';
import { NextFunction, Request, Response } from 'express';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { IProduct } from '../domain/interfaces/product.interface';
import { productSizes as prodSizes } from '../shared/fieldSize';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { Product } from '../data/schemas/product.schema';
import { productRepository as prodRepo } from '../data/repository/product.repository';
import { FilterProduct } from '../domain/models/filters/filterProduct.model';

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
    return ctrlFunc.delete(
      req, res, next, entityName,
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
    const reqKeys = [ 'currentPage', 'perPage'];
    const filterKeys = Object.keys(req.body);
    const filterValid = reqKeys.every(k => filterKeys.includes(k));
    const prods = await ctrlFunc.get<IProduct>(req, res, next,
      () => prodRepo.find(filterValid ? req.body : new FilterProduct())
    );

}

async function getById(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.getById<IProduct>(
      req, res, next, entityName,
      (id) => repoFunc.findById(id, Product)
    );
}

async function put(req: Request, res: Response, next: NextFunction) {
    const putObj = {
        desc: req.body.desc,
        price: req.body.price,
        percentOff: req.body.percentOff,
        freeDelivery: req.body.freeDelivery,
        amountAvailable: req.body.amountAvailable,
        categoriesId: req.body.categoriesId,
        title: req.body.title,
        urlMainImage: req.body.urlMainImage
    };
    return ctrlFunc.put<IProduct>(
      req, res, next, entityName, putObj, validateProduct,
      (id: string, obj: any) => repoFunc.update(id, obj, Product)
    );
}

export const productController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    put: put
};
