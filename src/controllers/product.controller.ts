'use strict';
import { Request, Response } from 'express';
import { PipelineValidation } from '../shared/validations';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { IProduct, IProductSchema } from '../domain/interfaces/product.interface';
import { productRepository as prodRepo } from '../data/repository/product.repository';
import { productSizes as prodSizes } from '../shared/fieldSize';

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

      .atLeastLenList('Categorias', prod.categories, 1, msg.minLenList)
      ;
}

async function delete_(req: Request, res: Response) {

    try {
        const prod: IProductSchema = await prodRepo.findBydId(req.params.id);

        if (!prod) {
            return res.status(404).send(
              serviceDataMsg.notFound(entityName, 'id', req.params.id)
            );
        }

        await prodRepo.delete(req.params.id);
        return res.status(200).send();
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function get(req: Request, res: Response) {

    try {
        const products = await prodRepo.find();
        return res.status(200).send(products);
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function getById(req: Request, res: Response) {

    try {
        const prod = await prodRepo.findBydId(req.params.id);

        if (!prod) {
            return res.status(404).send(
              serviceDataMsg.notFound(entityName, 'id', req.params.id)
            );
        }
        return res.status(200).send(prod);
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function post(req: Request, res: Response) {
    const pipe = validateProduct(req.body);

    if (!pipe.valid) {
        return res.status(400).send(pipe.errors);
    }

    try {
        const data = await prodRepo.create({
            ...req.body
        });
        return res.status(201).send(data);
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function put(req: Request, res: Response) {

    try {
        const prod: IProductSchema = await prodRepo.findBydId(req.params.id);

        if (!prod) {
            return res.status(404).send(
              serviceDataMsg.notFound(entityName, 'id', req.params.id)
            );
        }

        const pipe = validateProduct(req.body);

        if (!pipe.valid) {
            return res.status(400).send(pipe.errors);
        }

        await prodRepo.put(req.params.id, req.body);
        return res.status(200).send();

    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

export const productController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    put: put
};
