'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { ECollectionsName } from '../../collections-name.enum';
import { linkSizes } from '../../../shared/consts/fieldSize';
import { Link } from '../../../domain/models/lists-item/link';

const linkSchema = new Schema({
    title: {
        maxlength: linkSizes.titleMax,
        required: true,
        trim: true,
        type: String
    },
    url: {
        maxlength: linkSizes.urlMax,
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

export const LinkSchema: Model<LinkDBModel> = model<LinkDBModel>(ECollectionsName.LINK, linkSchema);

export interface LinkDBModel extends Document, Link {
}
