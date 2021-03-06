import { Schema } from 'mongoose';
import { ECollectionsName } from './collections-name.enum';
import { EUserRole } from '../domain/enum/role';
import { listSizes } from '../shared/consts/fieldSize';

export const buildListSchema = (collectionName: ECollectionsName): Schema => {
    const config = {
        itemsId: {
            default: [],
            type: [Schema.Types.ObjectId],
            ref: collectionName
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
    };
    const schema = new Schema(config);
    schema.virtual(
      'items',
      {
          ref: collectionName,
          localField: 'itemsId',
          foreignField: '_id'
      });
    return schema;
};

