'use strict';
import { model, Model, Schema } from 'mongoose';
import { ITokenInvalidSchema } from '../../domain/interfaces/tokenInvalid.interface';
import { ECollectionsName } from '../collectionsName.enum';

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: ECollectionsName.USER,
        required: true
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    }
});

export const TokenInvalid: Model<ITokenInvalidSchema> = model<ITokenInvalidSchema>(
  ECollectionsName.TOKEN_INVALID, tokenSchema
);
