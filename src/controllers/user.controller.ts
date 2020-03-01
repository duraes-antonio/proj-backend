'use strict';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { PipelineValidation } from '../shared/validations';
import { userSizes } from '../shared/fieldSize';
import { IUser } from '../domain/interfaces/user.interface';
import { userRepository } from '../data/repository/user.repository';
import { cryptService as cryptS } from '../services/crypt.service';
import { tokenService as tokenS } from '../services/tokenService';
import { Request, Response } from 'express';


function validateUser(user: IUser): PipelineValidation {
	return new PipelineValidation(msg.empty)
	  .atMaxLen('Nome', user.name, userSizes.nameMax, msg.maxLen)
	  .validEmail('Email', user.email, msg.invalidFormat)
	  .atMaxLen('Senha', user.password, userSizes.passwordMax, msg.maxLen);
}

export const userController = {
	post: async (req: Request, res: Response) => {
		const pipe = validateUser(req.body);

		if (!pipe.valid) {
			res.status(400).send(pipe.errors);
		}

		try {
			if (await userRepository.hasWithEmail(req.body.email)) {
				res.status(409).send(
				  serviceDataMsg.duplicate('Usuário', 'email', req.body.email)
				);
			}

			const user = await userRepository.create({
				...req.body,
				password: cryptS.encrypt(req.body.password)
			});

			const token = await tokenS.generate(user);
			res.status(201).send({
				token: token,
				user: {
					email: user.email,
					name: user.name
				}
			});
		} catch (err) {
			res.status(500).send(serviceDataMsg.unknown());
		}
	}
};
