'use strict';
import { userSizes } from '../../shared/fieldSize';

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
	createDate: {
		type: Date,
		required: true,
		default: Date.now
	}
});

export const User = mongoose.model('User', userSchema);
