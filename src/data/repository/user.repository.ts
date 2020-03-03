'use strict';
import { User } from '../schemas/user.schema';
import { IUser, IUserSchema } from '../../domain/interfaces/user.interface';

async function findByEmail(email: string): Promise<IUserSchema | null> {
    return await User.findOne({ email: email });
}

async function hasWithEmail(email: string): Promise<boolean> {
    return await User.exists({ email: email });
}

async function findById(id: string): Promise<IUserSchema | null> {
    return await User.findById(id);
}

async function create(user: IUser): Promise<IUserSchema> {
    return await new User(user).save();
}

async function update(id: string, user: IUser): Promise<IUserSchema | null> {
    console.log(user);
    return await User.findByIdAndUpdate(
      id,
      {
          $set: {
              name: user.name
          }
      }
    );
}

export const userRepository = {
    create: create,
    findByEmail: findByEmail,
    findById: findById,
    hasWithEmail: hasWithEmail,
    update: update
};
