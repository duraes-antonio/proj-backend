'use strict';

import { Document, Model } from 'mongoose';
import { IFilterBasic } from '../domain/interfaces/filters/filterBasic.interface';

async function create<T>(obj: T, model: Model<Document & T>): Promise<T> {
    const saved: Document = await new model({
        ...obj,
        createdAt: new Date(),
        updatedAt: new Date()
    }).save();
    // @ts-ignore
    return { ...saved._doc, id: saved._id };
}

async function delete_<T>(id: string, model: Model<Document & T>): Promise<T | null> {
    return await model.findByIdAndDelete(id);
}

async function find<T>(
  model: Model<Document & T>, f?: IFilterBasic, sort?: any): Promise<T[]> {
    let res: any[];

    if (f) {
        res = await model.find()
          .lean()
          .sort(sort ? sort : {})
          .skip((f.currentPage - 1) * f.perPage)
          .limit(f.perPage);
    } else {
        res = await model.find()
          .lean()
          .sort(sort ? sort : {});
    }

    return res.map(o => {
        // @ts-ignore
        return { ...o, id: o._id };
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
      { $set: { ...obj } },
      { new: true }
    );
    return updated && Object.keys(updated).length
      ? { ...updated, id: updated._id }
      : null;
}

export const repositoryFunctions = {
    create: create,
    delete: delete_,
    find: find,
    findById: findById,
    update: update
};
