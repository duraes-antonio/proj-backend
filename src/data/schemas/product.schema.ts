'use strict';
import { model, Model, Schema } from 'mongoose';
import { productSizes } from '../../shared/fieldSize';
import { IProductSchema } from '../../domain/interfaces/product.interface';

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
    categories: {
        default: [],
        required: true,
        type: [Schema.Types.ObjectId],
        ref: 'categories'
    },
    desc: {
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
        default: () => {
            return this.percentOff
              ? this.price * (100 - this.percentOff) / 100
              : this.price;
        },
        min: 0,
        required: true,
        trim: true,
        type: Number
    },
    title: {
        maxlength: productSizes.titleMax,
        required: true,
        trim: true,
        type: String
    },
    urlMainImage: {
        maxlength: productSizes.urlMainImageMax,
        required: false,
        trim: true,
        type: String
    }
});

export const Product: Model<IProductSchema> = model<IProductSchema>('Product', productSchema);
