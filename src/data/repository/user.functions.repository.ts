'use strict';
import { User } from '../schemas/user.schema';
import { IUser } from '../../domain/interfaces/user.interface';

async function delete_(id: string): Promise<IUser | null> {
    return await User.findByIdAndDelete(id);
}

async function find(params?: any): Promise<IUser[]> {
    return await User.find(params);
}

async function findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email });
}

async function hasWithEmail(email: string): Promise<boolean> {
    return await User.exists({ email: email });
}

export const userRepository = {
    delete: delete_,
    find: find,
    findByEmail: findByEmail,
    hasWithEmail: hasWithEmail
};
