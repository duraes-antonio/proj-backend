import { App } from '../src/app';
import { Request } from 'supertest';
import { FilterBasic } from '../src/domain/models/filters/filter-basic';
import { serviceDataMsg } from '../src/shared/buildMsg';

export type StringOptional = string | null | undefined;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const supertest = require('supertest');

const _delete = async (app: App, route: string, id: StringOptional, token?: string): Promise<Request> => {
    return supertest(app)
      .delete(`${route}/${id}`)
      .set('Authorization', token ?? '')
      .send();
};

const get = async (app: App, route: string, filter: (FilterBasic | object), token?: string): Promise<Request> => {
    return supertest(app)
      .get(route)
      .set('Authorization', token ?? '')
      .send(filter);
};

const getById = async (app: App, route: string, id: StringOptional, token?: string): Promise<Request> => {
    return supertest(app)
      .get(`${route}/${id}`)
      .set('Authorization', token ?? '')
      .send();
};

const patch = async (app: App, route: string, id: StringOptional, patchObj: object, token?: string): Promise<Request> => {
    return supertest(app)
      .patch(`${route}/${id}`)
      .set('Authorization', token ?? '')
      .send(patchObj);
};

const post = async <T>(
  app: App, route: string, data: T, token?: StringOptional, statusExpec = 201
): Promise<Request> => {
    const resPost = await supertest(app)
      .post(route)
      .set('Authorization', token ?? '')
      .send(data);
    expect(resPost.status).toBe(statusExpec);
    return resPost;
};


const postDuplicated = async <T>(
  app: App, route: string, data: T, token?: StringOptional
): Promise<void> => {
    const resPost = await supertest(app)
      .post(route)
      .set('Authorization', token ?? '')
      .send(data);
    expect(resPost.status).toBe(201);

    const resDuplicated = await supertest(app)
      .post(route)
      .set('Authorization', token ?? '')
      .send(data);
    expect(resDuplicated.status).toBe(409);
};


const getAndMatch = async <T>(
  app: App, route: string, filter: (FilterBasic | object), dataMatch: T[],
  token?: string, cmp?: (a: T, b: T) => number
): Promise<void> => {
    const res = await get(app, route, filter, token ?? '');
    expect(res.status).toBe(200);
    const body: T[] = res.body;
    expect(body.length === dataMatch.length).toBeTruthy();
    expect(cmp ? body.sort(cmp) : body)
      .toMatchObject(cmp ? dataMatch.sort(cmp) : dataMatch);
};

const postAndMatch = async <T>(
  app: App, route: string, data: T, token?: string
): Promise<Request> => {
    const resPost = await supertest(app)
      .post(route)
      .set('Authorization', token ?? '')
      .send(data);
    expect(resPost.status).toBe(201);
    expect(resPost.body).toMatchObject(data);
    return resPost;
};


const postAndDelete = async <T>(app: App, route: string, data: T, token: string): Promise<void> => {
    const resPost = await postAndMatch(app, route, data, token);
    const resPatch = await _delete(app, route, resPost.body.id, token);
    expect(resPatch.status).toBe(200);
    const resGetById = await getById(app, route, resPost.body.id, token);
    expect(resGetById.status).toBe(404);
};

const postAndGetById = async <T>(app: App, route: string, data: T, token?: string): Promise<void> => {
    const resPost = await postAndMatch(app, route, data, token ?? '');
    const resGet = await getById(app, route, resPost.body.id, token ?? '');
    expect(resGet.status).toBe(200);
    expect(resGet.body).toMatchObject(data);
};

const postAndPatch = async <T>(
  app: App, route: string, data: T, patchData: object, token?: string
): Promise<void> => {
    const resPost = await postAndMatch(app, route, data, token);
    const resPatch = await patch(
      app, route, resPost.body.id, patchData, token ?? resPost.header
    );
    expect(resPatch.status).toBe(200);
    expect(resPatch.body).toMatchObject({ ...data, ...patchData });
};


const deleteInvalidIds = async <T>(
  app: App, route: string, id: StringOptional, statusExpected: number,
  token?: string): Promise<void> => {
    const res = await _delete(app, route, id, token);
    expect(res.status).toBe(statusExpected);
};

const getByIdInvalidIds = async <T>(
  app: App, route: string, id: StringOptional, statusExpected: number,
  token?: string): Promise<void> => {
    const res = await getById(app, route, id, token);
    expect(res.status).toBe(statusExpected);
};

const patchInvalidIds = async <T>(
  app: App, route: string, id: StringOptional, statusExpected: number,
  token?: string): Promise<void> => {
    const res = await patch(app, route, id, {}, token);
    expect(res.status).toBe(statusExpected);
};


const deleteNotOwner = async <T>(
  app: App, route: string, data: T, tokenOwner: string, otherToken: string
): Promise<void> => {
    const resPost = await postAndMatch(app, route, data, tokenOwner);
    const resPatch = await _delete(app, route, resPost.body.id, otherToken);
    expect(resPatch.status).toBe(404);
};

const patchNotOwner = async <T>(
  app: App, route: string, data: T, tokenOwner: string, otherToken: string
): Promise<void> => {
    const resPost = await postAndMatch(app, route, data, tokenOwner);
    const resPatch = await patch(app, route, resPost.body.id, {}, otherToken);
    expect(resPatch.status).toBe(404);
};


const deleteOnlyAdmin = async <T>(app: App, route: string, token: string): Promise<void> => {
    const res = await _delete(app, route, '_', token);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe(serviceDataMsg.onlyAdmin().message);
};

const patchOnlyAdmin = async <T>(app: App, route: string, token: string): Promise<void> => {
    const res = await patch(app, route, '_', {}, token);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe(serviceDataMsg.onlyAdmin().message);
};

const postOnlyAdmin = async <T>(app: App, route: string, token: string): Promise<void> => {
    const res = await post(app, route, {}, token, 403);
    expect(res.body.message).toBe(serviceDataMsg.onlyAdmin().message);
};

export const testRest = {
    delete: _delete,
    deleteInvalidIds,
    deleteOnlyAdmin,
    deleteNotOwner,

    get,
    getAndMatch,
    getById,
    getByIdInvalidIds,

    patch,
    patchInvalidIds,
    patchOnlyAdmin,
    patchNotOwner,

    post,
    postAndDelete,
    postAndGetById,
    postAndMatch,
    postAndPatch,
    postDuplicated,
    postOnlyAdmin
};
