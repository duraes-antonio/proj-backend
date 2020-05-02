'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { productSizes } from '../../shared/fieldSize';
import { ECollectionsName } from '../collections-name.enum';
import { Product } from '../../domain/models/product';

const productSchema = new Schema({
    quantity: {
        default: 0,
        min: productSizes.quantityMin,
        max: productSizes.quantityMax,
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
    cost: {
        min: productSizes.costMin,
        max: productSizes.costMax,
        required: true,
        type: Number
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
    height: {
        min: productSizes.heightMin,
        max: productSizes.heightMax,
        required: true,
        type: Number
    },
    length: {
        min: productSizes.lengthMin,
        max: productSizes.lengthMax,
        required: true,
        type: Number
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
    weight: {
        min: productSizes.weightMin,
        max: productSizes.weightMax,
        required: true,
        type: Number
    },
    width: {
        min: productSizes.widthMin,
        max: productSizes.widthMax,
        required: true,
        type: Number
    },
    visible: {
        required: true,
        type: Boolean
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
