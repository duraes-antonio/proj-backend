'use strict';
import { PipelineValidation } from '../shared/validations';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { reviewSizes as sizes } from '../shared/fieldSize';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { IReview } from '../domain/interfaces/review.interface';
import { Review } from '../data/schemas/review.schema';
import { tokenService } from '../services/tokenService';
import { ITokenData } from '../services/interfaces/tokenData.interface';
import { EReviewSort, FilterReview } from '../domain/models/filters/filterReview.model';
import { reviewRepository } from '../data/repository/review.repository';
import { Messages } from '../shared/consts/messages';

export const entityName = 'Avaliação';

function validate(obj: IReview): PipelineValidation {
    return new PipelineValidation(msg.empty)
      .atLeastLen('Título da Avaliação', obj.title, sizes.titleMin, msg.minLen)
      .atMaxLen('Título da Avaliação', obj.title, sizes.titleMax, msg.maxLen)

      .atLeastLen('Comentário da Avaliação', obj.comment, sizes.commentMin, msg.minLen)
      .atMaxLen('Comentário da Avaliação', obj.comment, sizes.commentMax, msg.maxLen)

      .atLeastValue('Nota da Avaliação', obj.rating, sizes.ratingMin, msg.minValue)
      .atMaxValue('Nota da Avaliação', obj.rating, sizes.ratingMax, msg.maxValue)

      .hasValue('Id de Usuário', obj.userId)
      .hasValue('Id do Produto', obj.productId)
      .hasValue('Data da Avaliação', obj.date)
      ;
}

async function delete_(req: Request, res: Response, next: NextFunction) {
    /*TODO: Checar se o usuário é autor ou admin*/
    return ctrlFunc.delete(req, res, next, entityName,
      (id) => repoFunc.delete(id, Review)
    );
}

async function post(req: Request, res: Response, next: NextFunction) {
    const tokenData: ITokenData = await tokenService.decodeFromReq(req);
    const has = await reviewRepository.has(tokenData.id, req.body.productId);

    if (has) {
        return res.status(409).send(serviceDataMsg.custom(Messages.REVIEW_DUPLICATED));
    }

    const data: IReview = {
        ...req.body,
        date: new Date(),
        userId: tokenData.id
    };
    return await ctrlFunc.post<IReview>(
      req, res, next, () => repoFunc.create(data, Review), validate
    );
}

async function get(req: Request, res: Response, next: NextFunction) {
    const sortObj = {
        [EReviewSort.OLDEST]: {createdAt: 1},
        [EReviewSort.NEWEST]: {createdAt: -1},
        [EReviewSort.RATING_LOW]: {rating: 1},
        [EReviewSort.RATING_HIGH]: {rating: -1},
    };
    const f: FilterReview = req.body;
    return ctrlFunc.get<IReview>(
      req, res, next,
      () => repoFunc.find(Review, f, sortObj[f.sortBy])
    );
}

async function put(req: Request, res: Response, next: NextFunction) {
    /*TODO: Checar se o usuário é autor ou admin*/
    const putObj = {
        title: req.body.title,
        rating: req.body.rating,
        comment: 'new comment',
    };
    return ctrlFunc.put<IReview>(
      req, res, next, entityName, putObj, validate,
      (id, obj) => repoFunc.update(id, obj, Review)
    );
}

export const reviewController = {
    delete: delete_,
    get: get,
    post: post,
    put: put
};
