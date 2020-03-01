'use strict';
import { ITokenInvalid } from '../../domain/interfaces/tokenInvalid.interface';
import { TokenInvalid } from '../schemas/token.schema';

async function find(userId: string, token: string): Promise<ITokenInvalid> {
	return await TokenInvalid.findOne(
	  { userId: userId, token: token },
	  'token userId'
	);
}

async function create(value: { token: string, userId: string }): Promise<ITokenInvalid> {
	return await new TokenInvalid(value).save();
}

export const tokenRepository = {
	find: find,
	create: create
};
