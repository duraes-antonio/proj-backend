'use strict';
import { userSizes } from '../../shared/consts/fieldSize';
import { EUserRole } from '../../domain/enum/role';
import { ECollectionsName } from '../collections-name.enum';
import { Document, model, Model, Schema } from 'mongoose';
import { User } from '../../domain/models/user';

const userSchema = new Schema({
    avatarUrl: {
        maxlength: 256,
        required: false,
        type: String
    },
    codeArea: {
        required: true,
        type: Number
    },
    cpf: {
        maxlength: userSizes.cpfMax,
        required: true,
        trim: true,
        type: String,
        unique: true
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
    phone: {
        minlength: userSizes.phoneMin,
        maxlength: userSizes.phoneMax,
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

userSchema.index({ '$**': 'text' });

export const UserSchema: Model<UserDBModel> = model<UserDBModel>(ECollectionsName.USER, userSchema);

export interface UserDBModel extends Document, User {
}
