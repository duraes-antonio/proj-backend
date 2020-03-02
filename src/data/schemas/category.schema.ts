'use strict';
import { model, Model, Schema } from 'mongoose';
import { categorySizes } from '../../shared/fieldSize';
import { ICategorySchema } from '../../domain/interfaces/category.interface';

const categorySchema = new Schema({
    title: {
        maxlength: categorySizes.titleMax,
        required: true,
        trim: true,
        type: String
    }
});

export const Category: Model<ICategorySchema> = model<ICategorySchema>('Category', categorySchema);
