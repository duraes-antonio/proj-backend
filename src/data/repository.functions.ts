'use strict';

import { Document, Model } from 'mongoose';

async function create<T>(obj: T, model: Model<Document & T>): Promise<T> {
    const saved: Document = await new model({
        ...obj,
        createdAt: new Date(),
        updatedAt: new Date()
    }).save();
    // @ts-ignore
    return { ...saved._doc, id: saved._id } as T;
}

async function delete_<T>(id: string, model: Model<Document & T>): Promise<T | null> {
    return await model.findByIdAndDelete(id);
}

async function find<T>(model: Model<Document & T>): Promise<T[]> {
    const res: any[] = await model.find();
    return res.map(o => {
        return { ...o._doc, id: o._id };
    });
}

async function findById<T>(id: string, model: Model<Document & T>): Promise<T | null> {
    const obj = await model.findById(id);
    // @ts-ignore
    return obj ? { ...obj._doc, id: obj._id } : obj;
}

async function update<T>(id: string, obj: T, model: Model<Document & T>): Promise<T | null> {
    const updated = await model.findByIdAndUpdate(
      id,
      {
          $set: {
              ...obj,
              updatedAt: new Date()
          }
      },
      { new: true }
    );
    // @ts-ignore
    return updated ? { ...updated._doc, id: updated._id } : updated;
}

export const repositoryFunctions = {
    create: create,
    delete: delete_,
    find: find,
    findById: findById,
    update: update
};
