'use strict';
import { Document, model, Model, Schema } from 'mongoose';
import { TokenInvalid } from '../../domain/interfaces/token-invalid';
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

export const TokenInvalidSchema: Model<TokenInvalidDBModel> = model<TokenInvalidDBModel>(
  ECollectionsName.TOKEN_INVALID, tokenSchema
);

export interface TokenInvalidDBModel extends Document, TokenInvalid {
}
