'use strict';
import { NextFunction, Request, Response } from 'express';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { PipelineValidation } from '../shared/validations';
import { userSizes } from '../shared/fieldSize';
import { User } from '../data/schemas/user.schema';
import { IUser } from '../domain/interfaces/user.interface';
import { userRepository } from '../data/repository/user.repository';
import bcrypt from 'bcrypt';
import { config } from '../config';


function validateUser(user: IUser): PipelineValidation {
	return new PipelineValidation(msg.empty)
	  .atMaxLen('Nome', user.name, userSizes.nameMax, msg.maxLen)
	  .validEmail('Email', user.email, msg.invalidFormat)
	  .atMaxLen('Email', user.email, userSizes.emailMax, msg.maxLen);
}

export const userController = {
	authenticate: async (data: { email: string, password: string }) => {
		const re = await User.find({
			email: data.email,
			password: data.password
		});
	},

	// get: async (req: Request, res: Response, next: NextFunction) => {
	//
	// },

	post: async (req: Request, res: Response, next: NextFunction) => {
		const pipe = validateUser(req.body);

		if (!pipe.valid) {
			res.status(400).send(pipe.errors);
		}

		try {
			console.log(req.body);
			const pass = await bcrypt.hash(req.body.password, config.saltKey);
			const userPassCrypt = {
				...req.body,
				password: pass
			};
			const data = await userRepository.post(userPassCrypt);
			res.status(201).send(data);
		} catch (err) {
			console.log(err);
			res.status(500).send(serviceDataMsg.unknown());
		}
	}
};
