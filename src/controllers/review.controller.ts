'use strict';
import { serviceDataMsg } from '../shared/buildMsg';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { tokenService } from '../services/token.service';
import { TokenData } from '../domain/models/token-data';
import { EReviewSort, FilterReview } from '../domain/models/filters/filter-review';
import { reviewRepository } from '../data/repository/review.repository';
import { Messages } from '../shared/consts/messages';
import { Review } from '../domain/models/review';
import { ReviewSchema } from '../data/schemas/review.schema';
import { reviewService } from '../services/review.service';
import { EUserRole } from '../domain/enum/role.enum';

export const entityName = 'Avaliação';

async function delete_(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const userData = tokenService.decodeFromReq(req);
    const conditions = userData.roles.includes(EUserRole.ADMIN) ? {} : { 'userId': userData.id };
    return ctrlFunc.delete(req, res, next, entityName,
      (id) => repoFunc.delete(id, ReviewSchema, conditions)
    );
}

async function post(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const tokenData: TokenData = tokenService.decodeFromReq(req);
    const has: boolean = await reviewRepository.has(tokenData.id, req.body.productId);

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

async function getById(req: Request, res: Response, next: NextFunction): Promise<Response> {
    return ctrlFunc.getById<Review>(
      req, res, next, entityName,
      (id) => repoFunc.findById(id, ReviewSchema)
    );
}

async function patch(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const userData = tokenService.decodeFromReq(req);
    return ctrlFunc.patch<Review>(
      req, res, next, entityName,
      (obj) => reviewService.validate(obj, true),
      (id, obj) =>
        repoFunc.findAndUpdate(id, obj, ReviewSchema, { userId: userData.id }),
      ['comment', 'rating', 'title']
    );
}

export const reviewController = {
    delete: delete_,
    get,
    getById: getById,
    post,
    patch
};
