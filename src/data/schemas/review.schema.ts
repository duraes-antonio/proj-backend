'use strict';
import { model, Model, Schema } from 'mongoose';
import { ECollectionsName } from '../collectionsName.enum';
import { IReviewSchema } from '../../domain/interfaces/review.interface';
import { reviewSizes } from '../../shared/fieldSize';

const reviewSchema = new Schema({
    comment: {
        minlength: reviewSizes.commentMin,
        maxlength: reviewSizes.commentMax,
        required: true,
        trim: true,
        type: String
    },
    date: {
        required: true,
        type: Date
    },
    productId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: ECollectionsName.PRODUCT
    },
    rating: {
        min: reviewSizes.ratingMin,
        max: reviewSizes.ratingMax,
        required: false,
        type: Number
    },
    title: {
        minlength: reviewSizes.titleMin,
        maxlength: reviewSizes.titleMax,
        required: true,
        trim: true,
        type: String
    },
    userId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: ECollectionsName.USER
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    }
});
reviewSchema.index({ title: 'text' });
export const Review: Model<IReviewSchema> = model<IReviewSchema>(ECollectionsName.REVIEW, reviewSchema);