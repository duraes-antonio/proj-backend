'use strict';
import { userSizes } from '../../shared/fieldSize';
import { EUserRole } from '../../domain/enum/role.enum';
import { ECollectionsName } from '../collectionsName.enum';
import { model, Model, Schema } from 'mongoose';
import { IUserSchema } from '../../domain/interfaces/user.interface';

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
        default: EUserRole.CUSTOMER,
        enum: [EUserRole.ADMIN, EUserRole.CUSTOMER],
        type: [String]
    },

    createdAt: {
        default: Date.now,
        required: true,
        type: Date
    }
});

export const User: Model<IUserSchema> = model<IUserSchema>(ECollectionsName.USER, userSchema);
