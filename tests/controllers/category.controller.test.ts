'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { ICategory, ICategorySchema } from '../../src/domain/interfaces/category.interface';
import { FilterCategory } from '../../src/domain/models/filters/filterCategory.model';

const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;
const route = '/category';

const categoryRight: ICategory = {
    createdAt: new Date(),
    title: 'Card'
};
const categories = [
    { ...categoryRight, title: 'Cards' },
    { ...categoryRight, title: 'Deck Ultra-Raro' },
    { ...categoryRight, title: 'Action Figures' },
    { ...categoryRight, title: 'Vestuário' },
    { ...categoryRight, title: 'Acessórios' },
    { ...categoryRight, title: 'Deck Raros' },
    { ...categoryRight, title: 'Deck Comuns' },
];

describe('post', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
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

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
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
        await clearDatabase(await appInstance.databaseInstance);
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
          const body: ICategory[] = res.body;
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
          const body: ICategory[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length == 2);
          expect(body
            .every(c => c.title.includes(filter.text))
          ).toBeTruthy();
      });
});

describe('delete', () => {

    let categSaved: ICategorySchema;

    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
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
          expect((resGetAfterDel.body as ICategory[])
            .some(c => c.id == categSaved.id)
          ).toBe(false);
      });
});

describe('put', () => {

    let categSaved: ICategorySchema;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await request(app).post(route).send(categoryRight);
        expect(res.status).toBe(201);
        categSaved = res.body;
    });

    it(
      'invalid',
      async () => {
          const res = await request(app)
            .put(`/category/${categSaved.id.replace(/[0-9]/g, 'z')}`)
            .send({ ...categSaved });
          expect(res.status).toBe(400);
      });

    it(
      'valid',
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
