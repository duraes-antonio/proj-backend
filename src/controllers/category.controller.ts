'use strict';
import { Request, Response } from 'express';
import { PipelineValidation } from '../shared/validations';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { ICategory, ICategorySchema } from '../domain/interfaces/category.interface';
import { categorySizes } from '../shared/fieldSize';

export const entityName = 'Categoria';

function validateProduct(cat: ICategory): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atMaxLen('Título', cat.title, categorySizes.titleMax, msg.maxLen);
}

async function delete_(req: Request, res: Response) {

    try {
        const cat: ICategorySchema = await catRepo.findBydId(req.params.id);

        if (!cat) {
            return res.status(404).send(
              serviceDataMsg.notFound(entityName, 'id', req.params.id)
            );
        }

        await catRepo.delete(req.params.id);
        return res.status(200).send();
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function get(req: Request, res: Response) {

    try {
        const categories = await catRepo.find();
        return res.status(200).send(categories);
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function getById(req: Request, res: Response) {

    try {
        const cat = await catRepo.findBydId(req.params.id);

        if (!cat) {
            return res.status(404).send(
              serviceDataMsg.notFound(entityName, 'id', req.params.id)
            );
        }
        return res.status(200).send(cat);
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
        const data = await catRepo.create({
            ...req.body
        });
        return res.status(201).send(data);
    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

async function put(req: Request, res: Response) {

    try {
        const cat: ICategorySchema = await catRepo.findBydId(req.params.id);

        if (!cat) {
            return res.status(404).send(
              serviceDataMsg.notFound(entityName, 'id', req.params.id)
            );
        }

        const pipe = validateProduct(req.body);

        if (!pipe.valid) {
            return res.status(400).send(pipe.errors);
        }

        await catRepo.put(req.params.id, req.body);
        return res.status(200).send();

    } catch (err) {
        return res.status(500).send(serviceDataMsg.unknown());
    }
}

export const categoryController = {
    delete: delete_,
    get: get,
    getById: getById,
    post: post,
    put: put
};
