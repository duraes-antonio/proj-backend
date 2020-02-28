'use strict';
import { User } from '../schemas/user.schema';
import { IUser } from '../../domain/interfaces/user.interface';

async function get() {
	return await User.find();
}

async function getById(id: string) {
	return await User.findById(id);
}

/*TODO: Finalizar e padronizar messagens de erro*/
async function post(user: IUser) {
	return await new User(user).save();
}

/*TODO: Finalizar e padronizar messagens de erro*/
// async function put(id: string, addr: IAddress) {
// 	return await Address.findByIdAndUpdate(
// 	  id,
// 	  {
// 		  $set: {
// 			  zipCode: addr.zipCode,
// 			  state: addr.state,
// 			  city: addr.city,
// 			  number: addr.number,
// 			  street: addr.state,
// 			  neighborhood: addr.neighborhood
// 		  }
// 	  });
// }

export const userRepository = {
	get: get,
	getBydId: getById,
	post: post
};
