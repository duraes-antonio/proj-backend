'use strict';
import { Request, Response } from 'express';
import { PipelineValidation } from '../shared/validations';
import { addressSizes as addrSize } from '../shared/fieldSize';
import { serviceDataMsg, validationErrorMsg as msg } from '../shared/buildMsg';
import { IAddress } from '../domain/interfaces/address.interface';
import { addressRepository as addrRepo } from '../data/repository/address.repository';
import { tokenService as tokenS } from '../services/tokenService';
import { ITokenData } from '../services/interfaces/tokenData.interface';

function validateAddress(addr: IAddress): PipelineValidation {
	return new PipelineValidation(msg.empty)
	  .atMaxLen('Cidade', addr.city, addrSize.cityMax, msg.maxLen)
	  .atMaxLen('Bairro', addr.neighborhood, addrSize.neighborhoodMax, msg.maxLen)
	  .atMaxValue('Número', addr.number, addrSize.numberMax, msg.maxValue)
	  .atMaxLen('Estado', addr.state, addrSize.stateMax, msg.maxLen)
	  .atMaxLen('Logradouro', addr.street, addrSize.streetMax, msg.maxLen)
	  .validCEP('CEP', addr.zipCode, msg.invalidFormat);
}

async function delete_(req: Request, res: Response) {
	const uInfo: ITokenData = await tokenS.decodeFromReq(req);

	try {
		const addr: IAddress = await addrRepo.findBydId(req.params.id);

		if (!addr) {
			res.status(404).send(
			  serviceDataMsg.notFound('Endereço', 'id', req.params.id)
			);
		} else if (addr.userId.toString() !== uInfo.id) {
			res.status(403).send(serviceDataMsg.deniedAccessItem());
		}

		await addrRepo.delete(req.params.id);
		res.status(200).send();
	} catch (err) {
		res.status(500).send(serviceDataMsg.unknown());
	}
}

async function get(req: Request, res: Response) {
	const uInfo: ITokenData = await tokenS.decodeFromReq(req);

	try {
		const data = await addrRepo.find(uInfo.id);
		res.status(200).send(data);
	} catch (err) {
		res.status(500).send(serviceDataMsg.unknown());
	}
}

async function getById(req: Request, res: Response) {
	const uInfo: ITokenData = await tokenS.decodeFromReq(req);

	try {
		const addr: IAddress = await addrRepo.findBydId(req.params.id);

		if (!addr) {
			res.status(404).send(
			  serviceDataMsg.notFound('Endereço', 'id', req.params.id)
			);
		} else if (addr.userId.toString() !== uInfo.id) {
			res.status(403).send(serviceDataMsg.deniedAccessItem());
		}

		res.status(200).send(addr);
	} catch (err) {
		res.status(500).send(serviceDataMsg.unknown());
	}
}

async function post(req: Request, res: Response) {
	const pipe = validateAddress(req.body);

	if (!pipe.valid) {
		res.status(400).send(pipe.errors);
	}

	const tokenData: ITokenData = await tokenS.decodeFromReq(req);

	try {
		const data = await addrRepo.create({ ...req.body, userId: tokenData.id });
		res.status(201).send(data);
	} catch (err) {
		res.status(500).send(serviceDataMsg.unknown());
	}
}

async function put(req: Request, res: Response) {
	const uInfo: ITokenData = await tokenS.decodeFromReq(req);

	try {
		const addr: IAddress = await addrRepo.findBydId(req.params.id);

		if (!addr) {
			res.status(404).send(
			  serviceDataMsg.notFound('Endereço', 'id', req.params.id)
			);
		} else if (addr.userId.toString() !== uInfo.id) {
			res.status(403).send(serviceDataMsg.deniedAccessItem());
		}

		const pipe = validateAddress(req.body);

		if (!pipe.valid) {
			res.status(400).send(pipe.errors);
		}

		await addrRepo.put(req.params.id, req.body);
		res.status(200).send();

	} catch (err) {
		res.status(500).send(serviceDataMsg.unknown());
	}
}

export const addressController = {
	delete: delete_,
	get: get,
	getById: getById,
	post: post,
	put: put
};
