'use strict';
import { ReviewSchema } from '../schemas/review.schema';
import { Review } from '../../domain/models/review';
import { repositoryFunctions } from '../repository.functions';

const _getByUserProduct = async (userId: string, productId: string): Promise<Review | null> => {
    const review: any = await ReviewSchema.findOne({ productId, userId } as Review);
    return review ? repositoryFunctions.insertFieldId(review._doc) : null;
};

const _has = async (userId: string, productId: string): Promise<boolean> =>
  await ReviewSchema.exists({ productId, userId } as Review);

export const reviewRepository = {
    //get: _get,
    getByUserProduct: _getByUserProduct,
    has: _has
};
