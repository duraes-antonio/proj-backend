'use strict';
import { serviceDataMsg } from '../shared/buildMsg';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { tokenService } from '../services/token.service';
import { TokenData } from '../services/interfaces/tokenData.interface';
import { EReviewSort, FilterReview } from '../domain/models/filters/filterReview.model';
import { reviewRepository } from '../data/repository/review.repository';
import { Messages } from '../shared/consts/messages';
import { Review } from '../domain/models/review';
import { ReviewSchema } from '../data/schemas/review.schema';
import { reviewService } from '../services/review.service';

export const entityName = 'Avaliação';

async function delete_(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const userData = tokenService.decodeFromReq(req);
    return ctrlFunc.delete(req, res, next, entityName,
      (id) =>
        repoFunc.delete(id, ReviewSchema, { 'userId': userData.id })
    );
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const tokenData: TokenData = await tokenService.decodeFromReq(req);
    const has = await reviewRepository.has(tokenData.id, req.body.productId);

    if (has) {
        return res.status(409).send(serviceDataMsg.custom(Messages.REVIEW_DUPLICATED));
    }

    const data: Review = {
        ...req.body,
        date: new Date(),
        userId: tokenData.id
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await ctrlFunc.post<Review>(
      req, res, next,
      () => repoFunc.create(data, ReviewSchema),
      reviewService.validate
    );
}

async function get(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const sortObj = {
        [EReviewSort.OLDEST]: { createdAt: 1 },
        [EReviewSort.NEWEST]: { createdAt: -1 },
        [EReviewSort.RATING_LOW]: { rating: 1 },
        [EReviewSort.RATING_HIGH]: { rating: -1 }
    };
    const f: FilterReview = req.body;
    return ctrlFunc.get<Review>(
      req, res, next,
      () => repoFunc.find(ReviewSchema, f, sortObj[f.sortBy])
    );
}

async function patch(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const userData = tokenService.decodeFromReq(req);
    return ctrlFunc.patch<Review>(
      req, res, next, entityName, reviewService.validate,
      (id, obj) =>
        repoFunc.findAndUpdate(id, obj, ReviewSchema, { userId: userData.id }),
      ['comment', 'rating', 'title']
    );
}

export const reviewController = {
    delete: delete_,
    get: get,
    post: post,
    patch: patch
};
