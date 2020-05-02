'use strict';

import { UserSchema } from '../schemas/user.schema';
import { User } from '../../domain/models/user';
import { repositoryFunctions as repoFns } from '../repository.functions';

async function findByEmail(email: string): Promise<User | null> {
    const user = await UserSchema.findOne({ email: email }).lean();
    return Object.keys(user as object).length ? repoFns.insertFieldId(user) : null;
}

async function hasWithEmail(email: string): Promise<boolean> {
    return UserSchema.exists({ email: email });
}

export const userRepository = {
    findByEmail: findByEmail,
    hasWithEmail: hasWithEmail
};
