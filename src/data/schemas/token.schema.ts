'use strict';
import { model, Model, Schema } from 'mongoose';
import { ITokenInvalidSchema } from '../../domain/interfaces/tokenInvalid.interface';

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export const TokenInvalid: Model<ITokenInvalidSchema> = model<ITokenInvalidSchema>('TokenInvalid', tokenSchema);
