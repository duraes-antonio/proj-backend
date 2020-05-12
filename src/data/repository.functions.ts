'use strict';
import { Document, FilterQuery, Model } from 'mongoose';
import { FilterBasic } from '../domain/models/filters/filter-basic';
import { ObjectId } from 'bson';
import { utilService } from '../shared/util';

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

const createMany = async <T>(payload: T[], model: Model<Document & T>): Promise<T[]> => {
    const saveds: any = await model.insertMany(payload, { rawResult: true });
    return saveds.ops
      .map((item: Document & T) => {
          return { ...item, id: item._id.toString() };
      });
};

const create = async <T>(obj: T, model: Model<Document & T>): Promise<T> => {
    const saved = await new model({
        ...obj,
        createdAt: new Date()
    }).save();
    return insertFieldId((saved as any)._doc);
};

const delete_ = async <T>(id: string, model: Model<Document & T>, conditions?: object): Promise<T | null> => {
    const q: object = conditions ? { ...conditions, _id: id } : { _id: id };
    return model.findOneAndDelete(q);
};

const deleteMany = async <T>(ids: string[], model: Model<Document & T & any>): Promise<object> => {
    return model.deleteMany({
        _id: {
            $in: [ids.map(id => new ObjectId(id))]
        }
    });
};

const find = async <T>(
  model: Model<Document & T>, f?: FilterBasic, sort?: object,
  query?: object, populateFields?: string | object
): Promise<T[]> => {
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
};

const findById = async <T>(
  id: string, model: Model<Document & T>, populateFields?: string | string[] | object
): Promise<T | null> => {
    let obj;
    if (populateFields && populateFields instanceof Array) {
        let query: any = model.findById(id);
        populateFields.forEach(fieldName => {
            if (fieldName) {
                query = query.populate(fieldName);
            }
        });
        obj = await query.lean();
    } else {
        obj = await model.findById(id)
          .populate(populateFields ?? '')
          .lean();
    }
    return obj ? insertFieldId(obj) : null;
};

const findAndUpdate = async <T>(
  id: string, objPatch: any, model: Model<Document & T>,
  conditions?: FilterQuery<Document & T>
): Promise<T | null> => {
    let updated: any;
    const clearPatch = utilService.fromObjectIgnore(objPatch, undefined);

    if (conditions) {
        updated = await model.findOneAndUpdate(
          { _id: new ObjectId(id), ...conditions },
          { $set: clearPatch },
          { new: true }
        );
    } else {
        updated = await model.findByIdAndUpdate(
          id, { $set: clearPatch }, { new: true }
        );
    }
    return updated?._doc ? insertFieldId(updated._doc) : null;
};

const has = async <T>(model: Model<Document & T>, query: object): Promise<boolean> => {
    return await model.exists(query);
};

export const repositoryFunctions = {
    create: create,
    createMany,
    delete: delete_,
    deleteMany: deleteMany,
    find: find,
    findById: findById,
    findAndUpdate: findAndUpdate,
    has: has,
    insertFieldId
};
