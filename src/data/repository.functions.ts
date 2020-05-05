'use strict';
import { Document, Model } from 'mongoose';
import { FilterBasic } from '../domain/models/filters/filter-basic';
import { ObjectId } from 'bson';

const insertFieldId = (value: any): any => {

    if (!(value instanceof Object) || value instanceof ObjectId || value instanceof Date) {
        return value;
    }

    if (value instanceof Array) {
        return value.map(item => insertFieldId(item));
    } else {
        const clone = { ...value };

        Object.keys(value).forEach(key => {

            if (clone[key] instanceof Array) {
                (clone[key] as []).forEach((item, i) =>
                  clone[key][i] = insertFieldId(item)
                );
            } else {
                if ('_id' in clone) {
                    clone.id = clone._id.toString();
                }
                clone[key] = insertFieldId(clone[key]);
            }
        });
        delete clone.__v;
        delete clone._id;
        return clone;
    }
};

async function createMany<T>(payload: T[], model: Model<Document & T>): Promise<T[]> {
    const saveds: any = await model.insertMany(payload, { rawResult: true });
    return saveds.ops
      .map((item: Document & T) => {
          return { ...item, id: item._id.toString() };
      });
}

async function create<T>(obj: T, model: Model<Document & T>): Promise<T> {
    const saved = await new model({
        ...obj,
        createdAt: new Date()
    }).save();
    return insertFieldId((saved as any)._doc);
}

async function delete_<T>(id: string, model: Model<Document & T>, conditions?: object): Promise<T | null> {
    const q: object = conditions ? { ...conditions, _id: id } : { _id: id };
    return model.findOneAndDelete(q);
}

async function deleteMany<T>(ids: string[], model: Model<Document & T & any>): Promise<object> {
    return model.deleteMany({
        _id: {
            $in: [ids.map(id => new ObjectId(id))]
        }
    });
}

async function find<T>(
  model: Model<Document & T>, f?: FilterBasic, sort?: object,
  query?: object, populateFields?: string
): Promise<T[]> {
    let res: any[];

    if (f) {
        res = await model.find(query ?? {})
          .populate(populateFields ?? '')
          .lean()
          .sort(sort ? sort : {})
          .skip((+f.currentPage - 1) * +f.perPage)
          .limit(+f.perPage);
    } else {
        res = await model.find(query ?? {})
          .populate(populateFields ?? '')
          .lean()
          .sort(sort ? sort : {});
    }
    return insertFieldId(res);
}

async function findById<T>(
  id: string, model: Model<Document & T>, populateFields?: string | object
): Promise<T | null> {
    const obj: any = await model.findById(id)
      .populate(populateFields ?? '')
      .lean();
    return obj ? insertFieldId(obj) : null;
}

async function findAndUpdate<T>(
  id: string, obj: any, model: Model<Document & T>, conditions?: any
): Promise<T | null> {
    let updated: any;

    if (conditions) {
        updated = await model.findOneAndUpdate(
          { _id: new ObjectId(id), ...conditions },
          { $set: { ...obj } },
          { new: true }
        );
    } else {
        updated = await model.findByIdAndUpdate(
          id,
          { $set: { ...obj } },
          { new: true }
        );
    }
    return updated?._doc ? insertFieldId(updated._doc) : null;
}

export const repositoryFunctions = {
    create: create,
    createMany,
    delete: delete_,
    deleteMany,
    find: find,
    findById: findById,
    findAndUpdate: findAndUpdate,
    insertFieldId
};
