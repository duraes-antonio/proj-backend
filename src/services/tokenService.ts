'use strict';

import { config } from '../config';
import { NextFunction, Request, Response } from 'express';
import { serviceDataMsg } from '../shared/buildMsg';
import { tokenRepository as tokenRepo } from '../data/repository/token.repository';
import { ITokenData } from './interfaces/tokenData.interface';
import { IUser } from '../domain/interfaces/user.interface';

const jwt = require('jsonwebtoken');

function extractToken(req: Request): string | null {
	if (!req) {
		return null;
	}
	return req.body.token || req.query.token || req.headers['x-access-token'];
}

async function verifyToken(req: Request, res: Response, next: NextFunction) {
	const token = extractToken(req);

	if (token) {
		jwt.verify(token, config.saltKey, async (err, data: ITokenData) => {
			if (err) {
				res.status(401).send(serviceDataMsg.tokenInvalid());
			} else if (await tokenRepo.find(data.id, token)) {
				res.status(401).send(serviceDataMsg.tokenExpired());
			} else {
				next();
			}
		});
	} else {
		res.status(401).send({ message: serviceDataMsg.tokenEmpty() });
	}
}

async function decodeToken(token: string): Promise<ITokenData> {
	return await jwt.verify(token, config.saltKey);
}

async function decodeTokenReq(req: Request): Promise<ITokenData> {
	const token = extractToken(req);

	if (!token) {
		throw new Error(serviceDataMsg.tokenEmpty());
	}

	return await jwt.verify(extractToken(req), config.saltKey);
}

async function generateToken(data: ITokenData | IUser) {
	return await jwt.sign({
		  id: data.id,
		  email: data.email,
		  name: data.name
	  } as ITokenData,
	  config.saltKey,
	  { expiresIn: 60 * 15 }
	);
}

export const tokenService = {
	verify: verifyToken,
	decode: decodeToken,
	decodeFromReq: decodeTokenReq,
	extract: extractToken,
	generate: generateToken
};
