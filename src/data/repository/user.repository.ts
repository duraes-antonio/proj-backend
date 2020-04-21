'use strict';

import { UserSchema } from '../schemas/user.schema';
import { User } from '../../domain/models/user';

async function findByEmail(email: string): Promise<User | null> {
    return UserSchema.findOne({ email: email });
}

async function hasWithEmail(email: string): Promise<boolean> {
    return UserSchema.exists({ email: email });
}

export const userRepository = {
    findByEmail: findByEmail,
    hasWithEmail: hasWithEmail
};
