'use strict';
import { Document, Model } from 'mongoose';
import { FilterBasic } from '../domain/models/filters/filter-basic';
import { ObjectId } from 'bson';

async function create<T>(obj: T, model: Model<Document & T>): Promise<T> {
    const saved: any = await new model({
        ...obj,
        createdAt: new Date()
    }).save();
    return { ...saved._doc, id: saved._id };
}

async function delete_<T>(id: string, model: Model<Document & T>, conditions?: object): Promise<T | null> {
    const q: object = conditions ? { ...conditions, _id: id } : { _id: id };
    return await model.findOneAndDelete(q);
}

async function find<T>(
  model: Model<Document & T>, f?: FilterBasic, sort?: object, query?: object): Promise<T[]> {
    let res: any[];

    if (f) {
        res = await model.find(query ?? {})
          .lean()
          .sort(sort ? sort : {})
          .skip((f.currentPage - 1) * f.perPage)
          .limit(f.perPage);
    } else {
        res = await model.find(query ?? {})
          .lean()
          .sort(sort ? sort : {});
    }

    return res.map(o => {
        return { ...o, id: o._id };
    });
}

async function findById<T>(id: string, model: Model<Document & T>): Promise<T | null> {
    const obj: any = await model.findById(id).lean();
    return obj ? { ...obj, id: obj._id } : null;
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

async function findAndUpdate<T>(
  id: string, obj: T, model: Model<Document & T>, conditions: any
): Promise<T | null> {
    const updated: any = await model.findOneAndUpdate(
      { _id: new ObjectId(id), ...conditions },
      { $set: { ...obj } },
      { new: true }
    );
    return updated?._doc ? { ...updated._doc, id: updated._doc._id } : null;
}

export const repositoryFunctions = {
    create: create,
    delete: delete_,
    find: find,
    findById: findById,
    findAndUpdate: findAndUpdate,
    update: update
};
