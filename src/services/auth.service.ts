import * as jwt from '../../node_modules/jsonwebtoken';
import { config } from '../config';
import { NextFunction, Request, Response } from 'express';
import { serviceDataMsg } from '../shared/buildMsg';

export const authService = {
	generateToken: async function(data) {
		return await jwt.sign(data, config.keySalt, { expires: '1d' });
	},
	decodeToken: async function(token) {
		const data = await jwt.verify(token, config.keySalt);
	},
	authorize: async function(req: Request, res: Response, next: NextFunction) {
		const token = req.body.token || req.query.token || req.headers['x-access-token'];

		if (token) {
			jwt.verify(token, config.keySalt, (err, decoded) => {
				if (err) {
					res.status(401).send({ message: serviceDataMsg.invalidToken() });
				} else {
					next();
				}
			});
		} else {
			res.status(401).send({ message: serviceDataMsg.deniedAccess() });
		}
	}
};
