'use strict';

import { Document, Model } from 'mongoose';

async function create<T>(obj: T, model: Model<Document & T>): Promise<T> {
    return await new model({
        ...obj,
        createdAt: new Date(),
        updatedAt: new Date(),
    }).save();
}

async function delete_<T>(id: string, model: Model<Document & T>): Promise<T | null> {
    return await model.findByIdAndDelete(id);
}

async function find<T>(model: Model<Document & T>): Promise<T[]> {
    return await model.find();
}

async function findById<T>(id: string, model: Model<Document & T>): Promise<T | null> {
    return await model.findById(id);
}

async function update<T>(id: string, obj: T, model: Model<Document & T>): Promise<T | null> {
    return await model.findByIdAndUpdate(
      id,
      {
          $set: {
              ...obj,
              updatedAt: new Date(),
          }
      },
      { new: true }
    );
}

export const repositoryFunctions = {
    create: create,
    delete: delete_,
    find: find,
    findById: findById,
    update: update
};
