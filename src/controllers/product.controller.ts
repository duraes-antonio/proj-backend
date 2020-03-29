'use strict';
import { NextFunction, Request, Response } from 'express';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { Product, ProductAdd } from '../domain/interfaces/product.interface';
import { productSizes as prodSizes } from '../shared/fieldSize';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { productRepository as prodRepo } from '../data/repository/product.repository';
import { FilterProduct } from '../domain/models/filters/filterProduct.model';
import { ProductSchema } from '../data/schemas/product.schema';

export const entityName = 'Produto';

function validateProduct(prod: Product | ProductAdd): PipelineValidation {
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

async function delete_(req: Request, res: Response, next: NextFunction): Promise<Response> {
    return await ctrlFunc.delete(
      req, res, next, entityName,
      (id) => repoFunc.delete(id, ProductSchema)
    );
}

async function post(
  req: Request, res: Response, next: NextFunction
): Promise<Response<Product>> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await ctrlFunc.post<ProductAdd>(
      req, res, next,
      () => repoFunc.create(req.body, ProductSchema),
      validateProduct
    );
}

async function get(
  req: Request, res: Response, next: NextFunction
): Promise<Response<Product>> {
    const reqKeys = ['currentPage', 'perPage'];
    const filterKeys = Object.keys(req.body);
    const filterValid = reqKeys.every(k => filterKeys.includes(k));
    return await ctrlFunc.get<Product>(req, res, next,
      () => prodRepo.find(filterValid ? req.body : new FilterProduct())
    );
}

async function getById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    return await ctrlFunc.getById<Product>(
      req, res, next, entityName,
      (id) => repoFunc.findById(id, ProductSchema)
    );
}

/*TODO: Converter para patch*/
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
    return ctrlFunc.put<Product>(
      req, res, next, entityName, putObj, validateProduct,
      (id: string, obj: any) => repoFunc.update(id, obj, ProductSchema)
    );
}

export const productController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    put: put
};
