'use strict';
import { userSizes } from '../../shared/fieldSize';
import { EUserRole } from '../../domain/enum/role.enum';
import { ECollectionsName } from '../collections-name.enum';
import { Document, model, Model, Schema } from 'mongoose';
import { User } from '../../domain/models/user';

const userSchema = new Schema({
    avatarUrl: {
        maxlength: 256,
        required: false,
        type: String
    },
    email: {
        maxlength: userSizes.nameMax,
        required: true,
        trim: true,
        type: String,
        unique: true
    },
    name: {
        maxlength: userSizes.nameMax,
        required: true,
        trim: true,
        type: String
    },
    password: {
        maxlength: userSizes.passwordMax,
        required: true,
        trim: true,
        type: String
    },
    roles: {
        default: [EUserRole.CUSTOMER],
        enum: [EUserRole.ADMIN, EUserRole.CUSTOMER],
        type: [String]
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    }
});

export const UserSchema: Model<UserDBModel> = model<UserDBModel>(ECollectionsName.USER, userSchema);

export interface UserDBModel extends Document, User {
}
