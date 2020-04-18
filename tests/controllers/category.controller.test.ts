'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { Category, CategoryAdd } from '../../src/domain/models/category';
import { FilterCategory } from '../../src/domain/models/filters/filterCategory.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;
const route = '/category';

const categoryRight: CategoryAdd = {
    title: 'Card'
};
const categories: CategoryAdd[] = [
    { title: 'Cards' },
    { title: 'Deck Ultra-Raro' },
    { title: 'Action Figures' },
    { title: 'Vestuário' },
    { title: 'Acessórios' },
    { title: 'Deck Raros' },
    { title: 'Deck Comuns' }
];

describe('post', () => {
    beforeEach(async () => {
        clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'empty',
      async () => {
          const res = await request(app)
            .post(route)
            .send({});
          expect(res.status).toBe(400);
      });

    it(
      'title_long',
      async () => {
          const strPart = '12345678912345678912345678';
          const res = await request(app)
            .post(route)
            .send({
                title: [1, 2, 3, 4, 5]
                  .map(() => strPart)
                  .join(strPart)
            });
          expect(res.status).toBe(400);
      });

    it(
      'valid',
      async () => {
          const res = await request(app)
            .post(route)
            .send(categoryRight);
          expect(res.status).toBe(201);
      });
});

describe('get_by_id', () => {

    let categSaved: Category;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post(route)
          .send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'id_invalid',
      async () => {
          const res = await request(app)
            .get(`${route}/${1}`)
            .send();
          expect(res.status).toBe(400);
      });

    it(
      'object_inexistent',
      async () => {
          const res = await request(app)
            .get(`${route}/41224d776a326fb40f000001`)
            .send();
          expect(res.status).toBe(404);
      });

    it(
      'valid',
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

describe('get', () => {

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        await Promise.all(categories
          .map(async c => {
              const res = await request(app)
                .post(route)
                .send(c);
              expect(res.status).toBe(201);
          })
        );
    });

    it(
      'text_card',
      async () => {
          const filter = new FilterCategory();
          filter.text = 'card';

          const res = await request(app)
            .get(route)
            .send(filter);
          const body: Category[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length).toBeTruthy();
          expect(body.every(
            c => c.title
              .toLowerCase()
              .includes(filter.text)
          )).toBeTruthy();
      });

    it(
      'filter',
      async () => {
          const filter: FilterCategory = {
              countTotal: 0,
              currentPage: 1,
              perPage: 2,
              text: 'Card'
          };

          const res = await request(app)
            .get(`${route}`)
            .send(filter);
          const body: Category[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length == 2);
          expect(body
            .every(c => c.title.includes(filter.text))
          ).toBeTruthy();
      });
});

describe('delete', () => {

    let categSaved: Category;

    beforeEach(async () => {
        clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post(route)
          .send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'id_invalid',
      async () => {
          const res = await request(app)
            .delete(`${route}/${categSaved.id.replace(/[0-9]/g, 'z')}`)
            .send();
          expect(res.status).toBe(400);
      });

    it(
      'valid',
      async () => {
          const res = await request(app)
            .delete(`${route}/${categSaved.id}`)
            .send();
          expect(res.status).toBe(200);

          const resGetAfterDel = await request(app).get(route).send();

          expect(resGetAfterDel.status).toBe(200);
          expect((resGetAfterDel.body as Category[])
            .some(c => c.id == categSaved.id)
          ).toBe(false);
      });
});

describe('patch', () => {
    let categSaved: Category;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        const res = await request(app).post(route).send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it.each([
        { 'invalidField': 4, 'city': 'validField' },
        { 'notExist': 'string' },
        { 'id': 'notAllowed' },
        { 'createdAt': 'notAllowed' },
        { 'createdAt': 'notAllowed' }
    ])
    ('invalid_field',
      async (data) => {
          const res = await request(app)
            .patch(`${route}/${categSaved.id}`)
            .send(data);
          expect(res.status).toBe(400);
      });

    it.each([
        { 'title': null },
        { 'title': '' },
        { 'title': new Array(20).fill('0123456789').join() }
    ])
    ('invalid_value',
      async (data) => {
          const res = await request(app)
            .patch(`${route}/${categSaved.id}`)
            .send(data);
          expect(res.status).toBe(400);
      });

    it.each([
        { 'title': 'Title Right' }
    ])
    (
      'valid',
      async (data) => {
          const res = await request(app)
            .patch(`${route}/${categSaved.id}`)
            .send(data);
          expect(res.status).toBe(200);

          const resGet = await request(app)
            .get(`${route}/${categSaved.id}`)
            .send();
          expect(resGet.status).toBe(200);
          expect(resGet.body).toMatchObject(data);
      });
});
