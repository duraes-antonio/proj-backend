'use strict';
import { IAddress } from '../../domain/interfaces/address.interface';
import { Address } from '../schemas/address.schema';
import { IRepository } from '../repository.interface';

export class AddressRepository implements IRepository<IAddress> {

    async delete(id: string): Promise<IAddress | null> {
        return await Address.findByIdAndDelete(id);
    }

    async find(userId: string): Promise<IAddress[]> {
        return await Address.find(
          { userId: userId },
          'street number zipCode neighborhood city state userId'
        ).populate(['userId']);
    }

    async findById(id: string): Promise<IAddress | null> {
        return await Address.findById(
          id, 'street number zipCode neighborhood city state userId'
        );
    }

    async create(addr: IAddress): Promise<IAddress> {
        return await new Address(addr).save();
    }

    async update(id: string, addr: IAddress): Promise<IAddress | null> {
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
}
