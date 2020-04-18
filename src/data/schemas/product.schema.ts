'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { productSizes } from '../../shared/fieldSize';
import { ECollectionsName } from '../collectionsName.enum';
import { Product } from '../../domain/models/product';

const productSchema = new Schema({
    amountAvailable: {
        default: 0,
        min: productSizes.amountAvailableMin,
        max: productSizes.amountAvailableMax,
        required: true,
        type: Number
    },
    avgReview: {
        default: 0,
        min: 0,
        max: 5,
        required: false,
        type: Number
    },
    categoriesId: {
        default: [],
        required: true,
        type: [Schema.Types.ObjectId],
        ref: ECollectionsName.CATEGORY
    },
    desc: {
        index: true,
        maxlength: productSizes.descMax,
        required: true,
        trim: true,
        type: String
    },
    freeDelivery: {
        default: false,
        required: true,
        type: Boolean
    },
    percentOff: {
        default: 0,
        min: productSizes.percentOffMin,
        max: productSizes.percentOffMax,
        required: true,
        type: Number
    },
    price: {
        min: productSizes.priceMin,
        max: productSizes.priceMax,
        required: true,
        type: Number
    },
    priceWithDiscount: {
        default: 0,
        min: 0,
        required: true,
        trim: true,
        type: Number
    },
    title: {
        index: true,
        maxlength: productSizes.titleMax,
        required: true,
        trim: true,
        type: String
    },
    urlMainImage: {
        index: true,
        maxlength: productSizes.urlMainImageMax,
        required: false,
        trim: true,
        type: String
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    }
});

productSchema.index({ title: 'text', desc: 'text' });

export const ProductSchema: Model<ProductDBModel> = model<ProductDBModel>(ECollectionsName.PRODUCT, productSchema);

export interface ProductDBModel extends Document, Product {
}
