'use strict';
import { Review } from '../schemas/review.schema';
import { IReview } from '../../domain/interfaces/review.interface';

async function has(userId: string, productId: string): Promise<boolean> {
    return await Review.exists({ productId, userId } as IReview);
}

export const reviewRepository = {
    has: has
};
