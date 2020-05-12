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
        default: function(): number {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            return this.price * (1 - this.percentOff / 100);
        },
        min: 0,
        required: true,
        type: Number
    },
    title: {
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

productSchema.virtual(
  'categories',
  {
      foreignField: '_id',
      localField: 'categoriesId',
      ref: ECollectionsName.CATEGORY
  });

productSchema.index({ '$**': 'text' });

export const ProductSchema: Model<ProductDBModel> = model<ProductDBModel>(ECollectionsName.PRODUCT, productSchema);

export interface ProductDBModel extends Document, Product {
}
