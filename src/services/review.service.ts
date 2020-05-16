import { Review, ReviewAdd, ReviewPatch } from '../domain/models/review';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { reviewSizes as sizes } from '../shared/consts/fieldSize';
import { reviewRepository } from '../data/repository/review.repository';
import { DuplicatedErrorCustom, NotFoundError } from '../domain/helpers/error';
import { EUserRole } from '../domain/enum/role';
import { utilThrowError } from '../shared/util-throw-error';
import { repositoryFunctions as repoFunc, repositoryFunctions as repoFn } from '../data/repository.functions';
import { ReviewSchema } from '../data/schemas/review.schema';
import { EReviewSort, FilterReview } from '../domain/models/filters/filter-review';
import { Messages } from '../shared/consts/messages';

const entityName = 'Avaliação';
const sortObj = {
    [EReviewSort.OLDEST]: { createdAt: 1 },
    [EReviewSort.NEWEST]: { createdAt: -1 },
    [EReviewSort.RATING_LOW]: { rating: 1 },
    [EReviewSort.RATING_HIGH]: { rating: -1 }
};

const _create = async (
  userId: string, review: ReviewAdd, fnValidate: (review: ReviewAdd) => PipelineValidation
): Promise<Review> => {
    utilThrowError.checkAndThrowInvalidId(userId);
    const { comment, productId, rating, title } = review;
    utilThrowError.checkAndThrowBadResquest(review, fnValidate);
    utilThrowError.checkAndThrowInvalidId(review.productId);
    const has: boolean = await reviewRepository.has(userId, productId);

    if (has) {
        throw new DuplicatedErrorCustom(Messages.REVIEW_DUPLICATED);
    }

    return await repoFunc.create<ReviewAdd & { userId: string }>(
      { ...{ comment, productId, rating, title }, userId }, ReviewSchema
    ) as Review;
};

const _delete = async (id: string, userId: string, userRoles: EUserRole[]): Promise<void> => {
    utilThrowError.checkAndThrowInvalidId(id);
    const conditions = userRoles.includes(EUserRole.ADMIN) ? {} : { userId };
    const objDeleted = await repoFn.delete(id, ReviewSchema, conditions);
    if (!objDeleted) {
        throw new NotFoundError(entityName, 'id', id);
    }
};

const _find = async (filter?: FilterReview): Promise<Review[]> => {
    const sortBy = filter?.sortBy ? sortObj[filter.sortBy] : undefined;
    const conditions = filter?.productId ? { productId: filter?.productId } : undefined;
    return await repoFunc.find(ReviewSchema, filter, sortBy, conditions);
};

// Pode ser uma chamada a uma função genérica
const _findById = async (id: string): Promise<Review> => {
    utilThrowError.checkAndThrowInvalidId(id);
    const review = await repoFn.findById(id, ReviewSchema);
    if (!review) {
        throw new NotFoundError(entityName, 'id', id);
    }
    return review;
};

const _findByUserProduct = async (productId: string, userId: string): Promise<Review | null> => {
    utilThrowError.checkAndThrowInvalidId(productId);
    utilThrowError.checkAndThrowInvalidId(userId);
    return await reviewRepository.getByUserProduct(userId, productId);
};

const _update = async (
  id: string, userId: string, patchObject: ReviewPatch, fnValidate: (review: ReviewPatch) => PipelineValidation
): Promise<Review> => {
    utilThrowError.checkAndThrowInvalidId(id);
    const { comment, rating, title } = patchObject;
    utilThrowError.checkAndThrowBadResquest(patchObject, fnValidate);
    const objectUpdated = await repoFunc.findAndUpdate(
      id, { comment, rating, title }, ReviewSchema, { userId }
    );
    if (!objectUpdated) {
        throw new NotFoundError(entityName, 'id', id);
    }
    return objectUpdated;
};

const _validatePatch = (review: ReviewPatch, ignoreUndefined = true): PipelineValidation => {
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .atLeastLen('Title', review.title, sizes.titleMin, msg.minLen)
      .atMaxLen('Title', review.title, sizes.titleMax, msg.maxLen)

      .atLeastLen('Comment', review.comment, sizes.commentMin, msg.minLen)
      .atMaxLen('Comment', review.comment, sizes.commentMax, msg.maxLen)

      .atLeastValue('Rating', review.rating, sizes.ratingMin, msg.minValue)
      .atMaxValue('Rating', review.rating, sizes.ratingMax, msg.maxValue);
};

const _validate = (review: ReviewAdd): PipelineValidation => {
    return _validatePatch(review, false)
      .hasValue('ProductId', review.productId);
};

export const reviewService = {
    delete: _delete,
    find: _find,
    findById: _findById,
    findByUserProduct: _findByUserProduct,
    create: (userId: string, review: ReviewAdd): Promise<Review> =>
      _create(userId, review, _validate),
    update: (id: string, userId: string, review: ReviewPatch): Promise<Review> =>
      _update(id, userId, review, _validatePatch),
    validate: _validate,
    validatePatch: _validatePatch
};
