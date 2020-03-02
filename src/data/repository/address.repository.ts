'use strict';
import { IAddress, IAddressSchema } from '../../domain/interfaces/address.interface';
import { Address } from '../schemas/address.schema';

async function delete_(id: string): Promise<IAddressSchema | null> {
    return await Address.findByIdAndDelete(id);
}

async function find(userId: string): Promise<IAddressSchema[]> {
    return await Address.find(
      { userId: userId },
      'street number zipCode neighborhood city state userId'
    ).populate(['userId']);
}

async function findById(id: string): Promise<IAddressSchema | null> {
    return await Address.findById(
      id, 'street number zipCode neighborhood city state userId'
    );
}

async function create(addr: IAddress): Promise<IAddressSchema> {
    return await new Address(addr).save();
}

async function update(id: string, addr: IAddress): Promise<IAddressSchema | null> {
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
