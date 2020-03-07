'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { ICategory, ICategorySchema } from '../../src/domain/interfaces/category.interface';

const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;

function getErrorRequest(res: any) {
    return JSON.parse(res['text']);
}

const categoryRight: ICategory = { title: 'Card' };

describe('POST', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'Categoria sem título',
      async () => {
          const res = await request(app)
            .post('/category')
            .send({});
          expect(res.status).toBe(400);
      });

    it(
      'Categoria com título longo',
      async () => {
          const strPart = '12345678912345678912345678';
          const res = await request(app)
            .post('/category')
            .send({
                title: [1, 2, 3, 4, 5].map(() => strPart).join(strPart)
            });
          expect(res.status).toBe(400);
      });

    it(
      'True - Categoria válida',
      async () => {
          const res = await request(app)
            .post('/category')
            .send(categoryRight);
          expect(res.status).toBe(201);
      });
});

describe('GET BY ID', () => {

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post('/category')
          .send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'Categoria inexistente - ID Inválido',
      async () => {
          const res = await request(app)
            .get(`/category/${1}`)
            .send();
          expect(res.status).toBe(404);
      });

    it(
      'Categoria inexistente - ID válido',
      async () => {
          const res = await request(app)
            .get(`/category/41224d776a326fb40f000001`)
            .send();
          expect(res.status).toBe(404);
      });

    it(
      'Categoria existente',
      async () => {
          const resPost = await request(app)
            .post('/category')
            .send(categoryRight);
          expect(resPost.status).toBe(201);
          categSaved = resPost.body;

          const res = await request(app)
            .get(`/category/${categSaved._id}`)
            .send();
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('_id', categSaved._id);
          expect(res.body).toHaveProperty('title', categSaved.title);
      });
});

describe('GET', () => {

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post('/category')
          .send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'Categoria existente',
      async () => {
          const res = await request(app)
            .get(`/category/${categSaved._id}`)
            .send();
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('_id', categSaved._id);
          expect(res.body).toHaveProperty('title', categSaved.title);
      });
});

describe('DELETE', () => {

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post('/category')
          .send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'Categoria existente',
      async () => {
          const resGet = await request(app)
            .get(`/category/`)
            .send();
          expect(resGet.status).toBe(200);
          expect((resGet.body as ICategory[])
            .some(c => c._id == categSaved._id)
          ).toBe(true);

          const res = await request(app)
            .delete(`/category/${categSaved._id}`)
            .send();

          expect(res.status).toBe(200);

          const resGetAfterDel = await request(app)
            .get(`/category/`)
            .send();

          expect(resGetAfterDel.status).toBe(200);
          expect((resGetAfterDel.body as ICategory[])
            .some(c => c._id == categSaved._id)
          ).toBe(false);
      });
});

describe('PUT', () => {

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post('/category')
          .send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'Categoria existente',
      async () => {
          const newTitle = 'Novo título';
          const res = await request(app)
            .put(`/category/${categSaved._id}`)
            .send({...categSaved, title: newTitle});
          expect(res.status).toBe(200);

          const resGet = await request(app)
            .get(`/category/${categSaved._id}`)
            .send();
          expect(resGet.status).toBe(200);
          expect(resGet.body.title).toBe(newTitle);
      });
});
