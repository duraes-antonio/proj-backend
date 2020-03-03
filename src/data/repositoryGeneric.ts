'use strict';

import { Document, Model } from 'mongoose';

async function create<T>(obj: T, model: Model<Document & T>, respId?: string): Promise<T> {
    return await new model({
        ...obj,
        createdAt: new Date(),
        updatedAt: new Date(),
        responsibleId: respId ? respId : null
    }).save();
}

async function delete_<T>(obj: T, model: Model<Document & T>, id: string): Promise<T | null> {
    return await model.findByIdAndDelete(id);
}

async function find<T>(obj: T, model: Model<Document & T>): Promise<T[]> {
    return await model.find();
}

async function findById<T>(obj: T, model: Model<Document & T>, id: string): Promise<T | null> {
    return await model.findById(id);
}

async function update<T>(obj: T, model: Model<Document & T>, id: string, respId?: string): Promise<T | null> {
    return await model.findByIdAndUpdate(
      id,
      {
          $set: {
              ...obj,
              updatedAt: new Date(),
              responsibleId: respId ? respId : null
          }
      }
    );
}

export const repositoryFunc = {
    create: create,
    delete: delete_,
    find: find,
    findById: findById,
    update: update
};

//
// export abstract class ARepository<T> implements IRepository<T> {
//
//     private _model: Model<Document & T>;
//
//     constructor(model: Model<Document& T>) {
//         this._model = model;
//     }
//
//     create = async (obj: T, model: Model<Document & T> = this._model): Promise<T> => {
//         return await new model(obj).save();
//     };
//
//     delete = async (obj: T, model: Model<Document & T> = this._model): Promise<T> => {
//         return await new model(obj).save();
//     };
//
//     create = async (obj: T, model: Model<Document & T> = this._model): Promise<T> => {
//         return await new model(obj).save();
//     };
//
//     create = async (obj: T, model: Model<Document & T> = this._model): Promise<T> => {
//         return await new model(obj).save();
//     };
//
//     create = async (obj: T, model: Model<Document & T> = this._model): Promise<T> => {
//         return await new model(obj).save();
//     };
//
//     abstract delete(id: string): Promise<T | null>;
//
//     abstract find(): Promise<T[]>;
//
//     abstract findById(id: string): Promise<T | null>;
//
//     abstract update(id: string, obj: T): Promise<T | null>;
// }
