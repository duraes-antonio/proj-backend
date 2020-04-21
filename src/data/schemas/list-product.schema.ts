'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { ECollectionsName } from '../collections-name.enum';
import { listSizes } from '../../shared/fieldSize';
import { List } from '../../domain/models/lists/list';
import { EUserRole } from '../../domain/enum/role.enum';
import { Product } from '../../domain/models/product';

const listProductSchema = new Schema({
    itemsId: {
        default: [],
        type: [Schema.Types.ObjectId],
        ref: ECollectionsName.PRODUCT
    },

    readRole: {
        enum: [EUserRole.ADMIN, EUserRole.CUSTOMER, EUserRole.UNKNOWN],
        type: String
    },

    title: {
        minlength: listSizes.titleMin,
        maxlength: listSizes.titleMax,
        required: true,
        trim: true,
        type: String
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    }
});

listProductSchema.virtual(
  'items',
  {
      ref: ECollectionsName.PRODUCT,
      localField: 'itemsId',
      foreignField: '_id'
  });

export const ListProductSchema: Model<ListProductDBModel> = model<ListProductDBModel>(ECollectionsName.LIST_PRODUCT, listProductSchema);

export interface ListProductDBModel extends Document, List<Product> {
}
