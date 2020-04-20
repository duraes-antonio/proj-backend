'use strict';

import { TokenInvalidDBModel, TokenInvalidSchema } from '../schemas/token.schema';

async function find(userId: string, token: string): Promise<TokenInvalidDBModel | null> {
    return TokenInvalidSchema.findOne(
      { userId: userId, token: token },
      'token userId'
    );
}

async function create(value: { token: string; userId: string }): Promise<TokenInvalidDBModel> {
    return await new TokenInvalidSchema(value).save();
}

export const tokenRepository = {
    find: find,
    create: create
};
