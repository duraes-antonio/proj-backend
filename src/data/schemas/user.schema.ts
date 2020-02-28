'use strict';
import { Document, Model, model, Schema } from 'mongoose';
import { userSizes } from '../../shared/fieldSize';
import { IUser } from '../../domain/interfaces/user.interface';

interface IUserSchema extends IUser, Document {
}

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
	}
});

export const User: Model<IUserSchema> = model<IUserSchema>('User', userSchema);
