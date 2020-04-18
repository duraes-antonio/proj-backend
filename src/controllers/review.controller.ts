'use strict';
import { PipelineValidation } from '../shared/validations';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { reviewSizes as sizes } from '../shared/fieldSize';
import { NextFunction, Request, Response } from 'express';
import { controllerFunctions as ctrlFunc } from './base/controller.functions';
import { repositoryFunctions as repoFunc } from '../data/repository.functions';
import { tokenService } from '../services/tokenService';
import { TokenData } from '../services/interfaces/tokenData.interface';
import { EReviewSort, FilterReview } from '../domain/models/filters/filterReview.model';
import { reviewRepository } from '../data/repository/review.repository';
import { Messages } from '../shared/consts/messages';
import { Review } from '../domain/interfaces/review';
import { ReviewSchema } from '../data/schemas/review.schema';

export const entityName = 'Avaliação';

function validate(obj: Review): PipelineValidation {
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

async function delete_(req: Request, res: Response, next: NextFunction): Promise<Response> {
    /*TODO: Checar se o usuário é autor ou admin*/
    return ctrlFunc.delete(req, res, next, entityName,
      (id) => repoFunc.delete(id, ReviewSchema)
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
      () => repoFunc.create(data, ReviewSchema), validate
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

/*TODO: Converter para PATCH*/
async function put(req: Request, res: Response, next: NextFunction) {
    /*TODO: Checar se o usuário é autor ou admin*/
    const putObj = {
        title: req.body.title,
        rating: req.body.rating,
        comment: 'new comment'
    };
    return ctrlFunc.put<Review>(
      req, res, next, entityName, putObj, validate,
      (id, obj) => repoFunc.update(id, obj, ReviewSchema)
    );
}

export const reviewController = {
    delete: delete_,
    get: get,
    post: post,
    put: put
};
