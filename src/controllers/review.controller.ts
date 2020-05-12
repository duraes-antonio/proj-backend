'use strict';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { tokenService } from '../services/token.service';
import { reviewService } from '../services/review.service';
import { responseFunctions } from './base/response.functions';

export const entityName = 'Avaliação';

const _delete = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const userData = tokenService.decodeFromReq(req);
        await reviewService.delete(req.params.id, userData.id, userData.roles);
        return responseFunctions.success(res);
    } catch (e) {
        return res.status(e.code).send(e.message);
    }
};

const _post = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const userData = tokenService.decodeFromReq(req);
        const review = await reviewService.create(userData.id, req.body);
        return responseFunctions.created(res, review);
    } catch (e) {
        return res.status(e.code).send(e.messages ?? e.message);
    }
};

const _get = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const reviews = await reviewService.find(ctrlFunc.extractFilter(req));
        return responseFunctions.success(res, reviews);
    } catch (e) {
        return res.status(e.code).send(e.message);
    }
};

const _getById = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const review = await reviewService.findById(req.params.id);
        return responseFunctions.success(res, review);
    } catch (e) {
        return res.status(e.code).send(e.message);
    }
};

const _getByUserProduct = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const productId = req.params.productId;
    const userId = req.params.userId;

    try {
        const review = await reviewService.findByUserProduct(productId, userId);
        return responseFunctions.success(res, review);
    } catch (e) {
        return res.status(e.status ?? 500).send(e.message);
    }
};

const _patch = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const userData = tokenService.decodeFromReq(req);
    try {
        const review = await reviewService.update(req.params.id, userData.id, req.body);
        return responseFunctions.success(res, review);
    } catch (e) {
        return res.status(e.code).send(e.messages ?? e.message);
    }
};

export const reviewController = {
    delete: _delete,
    get: _get,
    getById: _getById,
    getByUserProduct: _getByUserProduct,
    post: _post,
    patch: _patch
};
