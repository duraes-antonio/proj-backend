'use strict';
import { Document, Model } from 'mongoose';
import { FilterBasic } from '../domain/interfaces/filters/filterBasic.interface';
import { ObjectId } from 'bson';

async function create<T>(obj: T, model: Model<Document & T>): Promise<T> {
    const saved: Document = await new model({
        ...obj,
        createdAt: new Date(),
        updatedAt: new Date()
    }).save();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return { ...saved._doc, id: saved._id };
}

async function delete_<T>(id: string, model: Model<Document & T>, query?: object): Promise<T | null> {
    const q = query ? { ...query, _id: id } : { _id: id };
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return await model.findOneAndDelete(q);
}

async function find<T>(
  model: Model<Document & T>, f?: FilterBasic, sort?: object, query?: object): Promise<T[]> {
    let res: (Document & T)[];

    if (f) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        res = await model.find(query ?? {})
          .lean()
          .sort(sort ? sort : {})
          .skip((f.currentPage - 1) * f.perPage)
          .limit(f.perPage);
    } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        res = await model.find(query ?? {})
          .lean()
          .sort(sort ? sort : {});
    }

    return res.map(o => {
        return { ...o, id: o._id };
    });
}

async function findById<T>(id: string, model: Model<Document & T>): Promise<T | null> {
    const obj = await model.findById(id);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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

async function findAndUpdate<T>(
  id: string, obj: T, model: Model<Document & T>, conditions: any
): Promise<T | null> {
    const updated: any = await model.findOneAndUpdate(
      { _id: new ObjectId(id), ...conditions },
      { $set: { ...obj } },
      { new: true }
    );
    return updated && Object.keys(updated).length
      ? { ...(updated._doc), id: updated._id }
      : null;
}

export const repositoryFunctions = {
    create: create,
    delete: delete_,
    find: find,
    findById: findById,
    findAndUpdate: findAndUpdate,
    update: update
};
