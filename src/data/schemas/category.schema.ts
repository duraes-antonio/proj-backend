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
      },
      createdAt: {
          type: Date,
          required: true,
          default: Date.now
      },
      updatedAt: {
          type: Date,
          required: true,
          default: Date.now
      },
      createdOn: {
          required: true,
          type: Date,
          set: Date.now,
          default: Date.now
      },
      updatedOn: {
          required: true,
          type: Date,
          default: Date.now
      },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
  },
  {
      timestamps: true
  });

categorySchema.pre('save', function(next) {
    const now = new Date();
    this.updated_at = now;
    if (!this.created_at) {
        this.created_at = now;
    }
    next();
});

export const Category: Model<ICategorySchema> = model<ICategorySchema>('Category', categorySchema);
