'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { ECollectionsName } from '../collectionsName.enum';
import { listSizes } from '../../shared/fieldSize';
import { List } from '../../domain/interfaces/lists/list';
import { EUserRole } from '../../domain/enum/role.enum';
import { Link } from '../../domain/interfaces/link';

const listLinkSchema = new Schema({
    itemsId: {
        default: [],
        type: [Schema.Types.ObjectId],
        ref: ECollectionsName.LINK
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

export const ListLinkSchema: Model<ListLinkDBModel> = model<ListLinkDBModel>(ECollectionsName.LIST_LINK, listLinkSchema);

export interface ListLinkDBModel extends Document, List<Link> {
}
