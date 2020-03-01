'use strict';
import { User } from '../schemas/user.schema';
import { IUser, IUserSchema } from '../../domain/interfaces/user.interface';

async function findByEmail(email): Promise<IUserSchema> {
    return await User.findOne({ email: email });
}

async function hasWithEmail(email): Promise<boolean> {
    return await User.exists({ email: email });
}

async function findById(id: string): Promise<IUserSchema> {
    return await User.findById(id);
}

async function create(user: IUser): Promise<IUserSchema> {
    return await new User(user).save();
}

export const userRepository = {
    create: create,
    findByEmail: findByEmail,
    findById: findById,
    hasWithEmail: hasWithEmail
};
