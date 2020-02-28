'use strict';
import { NextFunction, Request, Response } from 'express';
import { PipelineValidation } from '../shared/validations';
import { addressSizes as addrSize } from '../shared/fieldSize';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { IAddress } from '../domain/interfaces/address.interface';
import { addressRepository as addrRepo } from '../data/repository/address.repository';

function validateAddress(addr: IAddress): PipelineValidation {
	return new PipelineValidation(msg.empty)
	  .atMaxLen('Cidade', addr.city, addrSize.cityMax, msg.maxLen)
	  .atMaxLen('Bairro', addr.neighborhood, addrSize.neighborhoodMax, msg.maxLen)
	  .atMaxValue('Número', addr.number, addrSize.numberMax, msg.maxValue)
	  .atMaxLen('Estado', addr.state, addrSize.stateMax, msg.maxLen)
	  .atMaxLen('Logradouro', addr.street, addrSize.streetMax, msg.maxLen)
	  .validCEP('CEP', addr.zipCode, msg.invalidFormat);
}

export const addressController = {
	delete: async (req: Request, res: Response, next: NextFunction) => {
		await addrRepo.delete(req.params.id)
		  .then(re => {
			  res.status(200).send();
		  })
		  .catch(err => {
			  res.status(400).send(err);
		  });
	},

	get: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await addrRepo.get();
			res.status(200).send(data);
		} catch (err) {
			res.status(500).send(serviceDataMsg.unknown());
		}
	},

	getById: async (req: Request, res: Response, next: NextFunction) => {
		try {
			const data = await addrRepo.getBydId(req.params.id);
			res.status(200).send(data);
		} catch (err) {
			res.status(500).send(serviceDataMsg.unknown());
		}
	},

	post: async (req: Request, res: Response, next: NextFunction) => {

		const pipe = validateAddress(req.body);

		if (!pipe.valid) {
			res.status(400).send(pipe.errors);
		}

		try {
			const data = await addrRepo.post(req.body);
			res.status(201).send(data);
		} catch (err) {
			res.status(500).send(serviceDataMsg.unknown());
		}
	},

	/*TODO: Finalizar e padronizar messagens de erro*/
	put: async (req: Request, res: Response, next: NextFunction) => {
		const pipe = validateAddress(req.body);

		if (!pipe.valid) {
			res.status(400).send(pipe.errors);
		}

		try {
			const data = await addrRepo.put(req.params.id, req.body);
			res.status(200).send(data);
		} catch (err) {
			res.status(500).send(serviceDataMsg.unknown());
		}
	}
};
