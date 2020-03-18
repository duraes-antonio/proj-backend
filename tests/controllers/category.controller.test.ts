'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { ICategory, ICategorySchema } from '../../src/domain/interfaces/category.interface';
import { FilterCategory } from '../../src/domain/models/filters/filterCategory.model';

const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;
const route = '/category';

const categoryRight: ICategory = { title: 'Card' };

describe('POST', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'Categoria sem título',
      async () => {
          const res = await request(app).post(route).send({});
          expect(res.status).toBe(400);
      });

    it(
      'Categoria com título longo',
      async () => {
          const strPart = '12345678912345678912345678';
          const res = await request(app)
            .post(route)
            .send({
                title: [1, 2, 3, 4, 5].map(() => strPart).join(strPart)
            });
          expect(res.status).toBe(400);
      });

    it(
      'True - Categoria válida',
      async () => {
          const res = await request(app).post(route).send(categoryRight);
          expect(res.status).toBe(201);
      });
});

describe('GET BY ID', () => {

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await request(app).post(route).send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'Categoria inexistente - ID Inválido',
      async () => {
          const res = await request(app).get(`${route}/${1}`).send();
          expect(res.status).toBe(400);
      });

    it(
      'Categoria inexistente - ID válido',
      async () => {
          const res = await request(app)
            .get(`${route}/41224d776a326fb40f000001`)
            .send();
          expect(res.status).toBe(404);
      });

    it(
      'Categoria existente',
      async () => {
          const resPost = await request(app).post(route).send(categoryRight);
          expect(resPost.status).toBe(201);
          categSaved = resPost.body;

          const res = await request(app)
            .get(`${route}/${categSaved.id}`)
            .send();
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('id', categSaved.id);
          expect(res.body).toHaveProperty('title', categSaved.title);
      });
});

describe('GET', () => {

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await request(app).post(route).send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'Categoria existente',
      async () => {
          const res = await request(app)
            .get(`${route}/${categSaved.id}`)
            .send();
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty('id', categSaved.id);
          expect(res.body).toHaveProperty('title', categSaved.title);
      });
});

describe('GET - FILTER', () => {

    const cat1: ICategory = { title: 'Cards' };
    const cat2: ICategory = { title: 'Action Figures' };
    const cat3: ICategory = { title: 'Pack de Cards - 30 card' };

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res1 = await request(app).post(route).send(cat1);
        expect(res1.status).toBe(201);
        const res2 = await request(app).post(route).send(cat2);
        expect(res2.status).toBe(201);
        const res3 = await request(app).post(route).send(cat3);
        expect(res3.status).toBe(201);
    });

    it(
      'Filter: Text - "Card"',
      async () => {
          const filter = new FilterCategory();
          filter.text = 'card';

          const res = await request(app)
            .get(`${route}`)
            .query(filter);

          expect(res.status).toBe(200);
          expect((res.body as ICategory[])
            .every(c => c.title.toLowerCase().includes(filter.text))
          ).toBeTruthy();
      });

    it(
      'Filter - Skip: 1 - Limit: 1',
      async () => {
          const filter: FilterCategory = {
              countTotal: 0,
              currentPage: 2,
              perPage: 1,
              text: 'Card'
          };

          const res = await request(app).get(`${route}`).query(filter);
          expect(res.status).toBe(200);
          expect((res.body as ICategory[])[0].title === cat1.title)
            .toBeTruthy();
      });
});

describe('DELETE', () => {

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await request(app).post(route).send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'Invalid ID',
      async () => {
          const res = await request(app)
            .delete(`${route}/${categSaved.id.replace('0', 'x')}`)
            .send();
          expect(res.status).toBe(400);
      });

    it(
      'Valid Category',
      async () => {
          const res = await request(app)
            .delete(`${route}/${categSaved.id}`)
            .send();
          expect(res.status).toBe(200);

          const resGetAfterDel = await request(app).get(route).send();

          expect(resGetAfterDel.status).toBe(200);
          expect((resGetAfterDel.body as ICategory[])
            .some(c => c.id == categSaved.id)
          ).toBe(false);
      });
});

describe('PUT', () => {

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await request(app).post(route).send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'Invalid ID',
      async () => {
          const res = await request(app)
            .put(`/category/${categSaved.id.replace('0', 'x')}`)
            .send({ ...categSaved });
          expect(res.status).toBe(400);
      });

    it(
      'Valid Category',
      async () => {
          const newTitle = 'Novo título';
          const res = await request(app)
            .put(`/category/${categSaved.id}`)
            .send({ ...categSaved, title: newTitle });
          expect(res.status).toBe(200);

          const resGet = await request(app)
            .get(`/category/${categSaved.id}`)
            .send();
          expect(resGet.status).toBe(200);
          expect(resGet.body.title).toBe(newTitle);
      });
});
