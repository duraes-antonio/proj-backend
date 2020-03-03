'use strict';
import { model, Model, Schema } from 'mongoose';
import { categorySizes } from '../../shared/fieldSize';
import { ICategorySchema } from '../../domain/interfaces/category.interface';
import { ECollectionsName } from '../collectionsName.enum';

const categorySchema = new Schema({
    title: {
        maxlength: categorySizes.titleMax,
        required: true,
        trim: true,
        type: String
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    },
    updatedAt: {
        default: Date.now,
        required: true,
        type: Date
    },
    responsibleId: {
        ref: ECollectionsName.USER,
        required: true,
        type: Schema.Types.ObjectId
    }
});

export const Category: Model<ICategorySchema> = model<ICategorySchema>(ECollectionsName.CATEGORY, categorySchema);
