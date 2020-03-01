'use strict';
import { userSizes } from '../../shared/fieldSize';
import { EUserRole } from '../../domain/enum/role.enum';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
    createDate: {
        default: Date.now,
        required: true,
        type: Date
    }
});

export const User = mongoose.model('User', userSchema);
