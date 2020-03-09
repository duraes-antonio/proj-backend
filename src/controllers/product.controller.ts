'use strict';
import { NextFunction, Request, Response } from 'express';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { IProduct } from '../domain/interfaces/product.interface';
import { productSizes as prodSizes } from '../shared/fieldSize';
import { controllerFunctions as ctrlFunc } from './base/controller.abstract';
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
    const oldF: FilterProduct = req.query;
    const filter: FilterProduct = {
        avgReview: oldF.avgReview ? oldF.avgReview.map(n => +n) : [],
        categoriesId: oldF.categoriesId,
        countTotal: +oldF.countTotal,
        currentPage: +oldF.currentPage,
        dateEnd: oldF.dateEnd,
        dateStart: oldF.dateStart,
        discounts: oldF.discounts ? oldF.discounts.map(d => d.map(n => +n)) : [],
        freeDelivery: oldF.freeDelivery,
        perPage: +oldF.perPage,
        priceMax: +oldF.priceMax,
        priceMin: +oldF.priceMin,
        text: oldF.text
    };
    return ctrlFunc.get<IProduct>(req, res, next, () => prodRepo.find(filter));
}

async function getById(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.getById<IProduct>(
      req, res, next, entityName,
      (id) => repoFunc.findById(id, Product)
    );
}

async function put(req: Request, res: Response, next: NextFunction) {
    return ctrlFunc.put<IProduct>(
      req, res, next, entityName, validateProduct,
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
