'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { itemOrderSizes, productSizes } from '../../shared/fieldSize';
import { ECollectionsName } from '../collections-name.enum';
import { ItemOrder } from '../../domain/models/item-order';

const itemOrderSchema = new Schema({
    productId: {
        ref: ECollectionsName.PRODUCT,
        required: true,
        type: Schema.Types.ObjectId
    },
    quantity: {
        min: itemOrderSizes.quantityMin,
        max: itemOrderSizes.quantityMax,
        required: true,
        type: Number
    },
    unitPrice: {
        min: productSizes.priceMin,
        max: productSizes.priceMax,
        required: true,
        type: Number
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    }
});

itemOrderSchema.virtual(
  'product',
  {
      foreignField: '_id',
      justOne: true,
      localField: 'productId',
      ref: ECollectionsName.PRODUCT
  });


export const ItemOrderSchema: Model<ItemOrderDBModel> = model<ItemOrderDBModel>(ECollectionsName.ITEM_ORDER, itemOrderSchema);

export interface ItemOrderDBModel extends Document, ItemOrder {
}
