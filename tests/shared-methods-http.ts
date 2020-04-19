import { App } from '../src/app';
import { Request } from 'supertest';
import { FilterBasic } from '../src/domain/models/filters/filter-basic';

export type StringOptional = string | null | undefined;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const supertest = require('supertest');

const _delete = async (app: App, route: string, id: StringOptional, token?: string): Promise<Request> => {
    return await supertest(app)
      .delete(`${route}/${id}`)
      .set('Authorization', token)
      .send();
};

const get = async (app: App, route: string, filter: (FilterBasic | any), token?: string): Promise<Request> => {
    return await supertest(app)
      .get(route)
      .set('Authorization', token ?? '')
      .send(filter);
};


const getById = async (app: App, route: string, id: StringOptional, token?: string): Promise<Request> => {
    return await supertest(app)
      .get(`${route}/${id}`)
      .set('Authorization', token)
      .send();
};


const patch = async (app: App, route: string, id: StringOptional, patchObj: object, token?: string): Promise<Request> => {
    return await supertest(app)
      .patch(`${route}/${id}`)
      .set('Authorization', token)
      .send(patchObj);
};

const post = async (app: App, route: string, obj: object, token?: string): Promise<Request> => {
    return await supertest(app)
      .post(route)
      .set('Authorization', token)
      .send(obj);
};

export const testRest = {
    delete: _delete,
    get,
    getById,
    patch,
    post
};
