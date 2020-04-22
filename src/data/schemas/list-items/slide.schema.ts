'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { ECollectionsName } from '../../collections-name.enum';
import { Slide } from '../../../domain/models/lists-item/slide';

const slideSchema = new Schema({
    btnTitle: {
        required: false,
        trim: true,
        type: String
    },
    desc: {
        required: false,
        trim: true,
        type: String
    },
    imageUrl: {
        required: true,
        trim: true,
        type: String
    },
    index: {
        required: true,
        type: Number
    },
    title: {
        required: false,
        trim: true,
        type: String
    },
    url: {
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

export const SlideSchema: Model<SlideDBModel> = model<SlideDBModel>(ECollectionsName.SLIDE, slideSchema);

export interface SlideDBModel extends Document, Slide {
}
