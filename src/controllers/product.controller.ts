'use strict';
import { NextFunction, Request, Response } from 'express';
import { Product, ProductAdd } from '../domain/models/product';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { productRepository as prodRepo } from '../data/repository/product.repository';
import { ProductSchema } from '../data/schemas/product.schema';
import { productService } from '../services/product.service';
import { responseFunctions } from './base/response.functions';

export const entityName = 'Produto';

async function delete_(req: Request, res: Response, next: NextFunction): Promise<Response> {
    return await ctrlFunc.delete(
      req, res, next, entityName,
      (id) => repoFunc.delete(id, ProductSchema)
    );
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response<Product>> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await ctrlFunc.post<ProductAdd>(
      req, res, next,
      () => repoFunc.create(req.body, ProductSchema),
      productService.validate
    );
}

async function get(req: Request, res: Response, next: NextFunction): Promise<Response<Product[]>> {
    return await ctrlFunc.get<Product>(req, res, next,
      (filter) => prodRepo.find(filter)
    );
}

async function getCount(req: Request, res: Response, next: NextFunction): Promise<Response<number>> {
    const filter = req.query && Object.keys(req.query).length ? req.query : req.body;
    return responseFunctions.success(res, await prodRepo.findCount(filter));
}

async function getById(req: Request, res: Response, next: NextFunction): Promise<Response<Product>> {
    return await ctrlFunc.getById<Product>(
      req, res, next, entityName,
      (id) => repoFunc.findById(id, ProductSchema)
    );
}

async function patch(req: Request, res: Response, next: NextFunction): Promise<Response<Product>> {
    return ctrlFunc.patch<Product>(
      req, res, next, entityName,
      (product) => productService.validate(product, true),
      (id, obj) => repoFunc.findAndUpdate(id, obj, ProductSchema),
      [
          'title', 'desc', 'price', 'cost', 'percentOff', 'height', 'length',
          'width', 'weight', 'amountAvailable', 'freeDelivery', 'categoriesId', 'visible'
      ]);
}

export const productController = {
    delete: delete_,
    get,
    getById,
    getCount,
    post,
    patch
};
