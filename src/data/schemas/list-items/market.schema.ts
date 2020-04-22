'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { ECollectionsName } from '../../collections-name.enum';
import { Market } from '../../../domain/models/lists-item/market';

const marketSchema = new Schema({
    avatarUrl: {
        required: true,
        trim: true,
        type: String
    },
    backgroundUrl: {
        required: true,
        trim: true,
        type: String
    },
    index: {
        required: true,
        type: Number
    },
    name: {
        required: true,
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

export const MarketSchema: Model<MarketDBModel> = model<MarketDBModel>(ECollectionsName.MARKET, marketSchema);

export interface MarketDBModel extends Document, Market {
}
