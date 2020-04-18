'use strict';

import { ReviewSchema } from '../schemas/review.schema';
import { Review } from '../../domain/models/review';

async function has(userId: string, productId: string): Promise<boolean> {
    return await ReviewSchema.exists({ productId, userId } as Review);
}

export const reviewRepository = {
    has: has
};
