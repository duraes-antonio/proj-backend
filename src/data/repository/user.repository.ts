'use strict';
import { User } from '../schemas/user.schema';
import { IUser } from '../../domain/interfaces/user.interface';

async function authenticate(data: { email: string, password: string }): Promise<IUser> {
	return await User.findOne({
		email: data.email,
		password: data.password
	});
}

async function findByEmail(email): Promise<IUser> {
	return await User.findOne({ email: email });
}

async function hasWithEmail(email): Promise<boolean> {
	return await User.exists({ email: email });
}

async function findById(id: string): Promise<IUser> {
	return await User.findById(id);
}

async function create(user: IUser): Promise<IUser> {
	return await new User(user).save();
}

export const userRepository = {
	authenticate: authenticate,
	create: create,
	findByEmail: findByEmail,
	findById: findById,
	hasWithEmail: hasWithEmail
};
