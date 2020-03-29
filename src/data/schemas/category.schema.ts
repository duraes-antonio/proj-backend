'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { categorySizes } from '../../shared/fieldSize';
import { Category } from '../../domain/interfaces/category.interface';
import { ECollectionsName } from '../collectionsName.enum';

const categorySchema = new Schema({
    title: {
        index: true,
        maxlength: categorySizes.titleMax,
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
categorySchema.index({ title: 'text' });
export const CategorySchema: Model<CategoryDBModel> = model<CategoryDBModel>(ECollectionsName.CATEGORY, categorySchema);

export interface CategoryDBModel extends Document, Category {
}
