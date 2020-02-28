'use strict';
import { IAddress } from '../../domain/interfaces/address.interface';
import { Address } from '../schemas/address.schema';

async function delete_(id: string) {
	return await Address.findByIdAndRemove(id);
}

async function get() {
	return await Address.find();
}

async function getById(id: string) {
	return await Address.findById(id);
}

/*TODO: Finalizar e padronizar messagens de erro*/
async function post(addr: IAddress) {
	return await new Address(addr).save();
}

/*TODO: Finalizar e padronizar messagens de erro*/
async function put(id: string, addr: IAddress) {
	return await Address.findByIdAndUpdate(
	  id,
	  {
		  $set: {
			  zipCode: addr.zipCode,
			  state: addr.state,
			  city: addr.city,
			  number: addr.number,
			  street: addr.state,
			  neighborhood: addr.neighborhood
		  }
	  });
}

export const addressRepository = {
	delete: delete_,
	get: get,
	getBydId: getById,
	post: post,
	put: put
};
