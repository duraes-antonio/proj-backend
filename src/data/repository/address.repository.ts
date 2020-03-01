'use strict';
import { IAddress } from '../../domain/interfaces/address.interface';
import { Address } from '../schemas/address.schema';

async function delete_(id: string): Promise<IAddress> {
	return await Address.findByIdAndDelete(id);
}

async function find(userId: string): Promise<IAddress[]> {
	return await Address.find(
	  { userId: userId },
	  'street number zipCode neighborhood city state userId'
	).populate(['userId']);
}

async function findById(id: string): Promise<IAddress> {
	return await Address.findById(
	  id, 'street number zipCode neighborhood city state userId'
	);
}

async function create(addr: IAddress): Promise<IAddress> {
	return await new Address(addr).save();
}

async function update(id: string, addr: IAddress): Promise<IAddress> {
	return await Address.findByIdAndUpdate(
	  id,
	  {
		  $set: {
			  zipCode: addr.zipCode,
			  state: addr.state,
			  city: addr.city,
			  number: addr.number,
			  street: addr.street,
			  neighborhood: addr.neighborhood
		  }
	  }
	);
}

export const addressRepository = {
	delete: delete_,
	find: find,
	findBydId: findById,
	create: create,
	put: update
};
