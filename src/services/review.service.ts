import { ReviewAdd } from '../domain/models/review';
import { PipelineValidation } from '../shared/validations';
import { validationErrorMsg as msg } from '../shared/buildMsg';
import { reviewSizes as sizes } from '../shared/fieldSize';

function validate(review: ReviewAdd, ignoreUndefined = false): PipelineValidation {
    return new PipelineValidation(msg.empty, ignoreUndefined)
      .atLeastLen('Title', review.title, sizes.titleMin, msg.minLen)
      .atMaxLen('Title', review.title, sizes.titleMax, msg.maxLen)

      .atLeastLen('Comment', review.comment, sizes.commentMin, msg.minLen)
      .atMaxLen('Comment', review.comment, sizes.commentMax, msg.maxLen)

      .atLeastValue('Rating', review.rating, sizes.ratingMin, msg.minValue)
      .atMaxValue('Rating', review.rating, sizes.ratingMax, msg.maxValue)

      .hasValue('ProductId', review.productId);
}

export const reviewService = {
    validate
};
