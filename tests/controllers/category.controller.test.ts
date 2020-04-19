'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { Category, CategoryAdd } from '../../src/domain/models/category';
import { FilterCategory } from '../../src/domain/models/filters/filter-category';
import { TestObject } from '../test-object';
import { serviceDataMsg, validationErrorMsg } from '../../src/shared/buildMsg';
import { generators } from '../../utils/generators';
import { categorySizes } from '../../src/shared/fieldSize';
import { invalidFieldsPatch, invalidIds, shared, usersAdd } from '../shared-data';
import { testRest } from '../shared-methods-http';

const appInstance = new App();
const app = appInstance.express;
const route = '/category';

const categoryAdd: CategoryAdd = {
    title: 'Card'
};
const categoryAddList: CategoryAdd[] = [
    { title: 'Cards' },
    { title: 'Deck Ultra-Raro' },
    { title: 'Action Figures' },
    { title: 'Vestuário' },
    { title: 'Acessórios' },
    { title: 'Deck Raros' },
    { title: 'Deck Comuns' }
];
let token: string;
let tokenAdmin: string;

const postCategory = async (categ: CategoryAdd, token: string): Promise<Category> => {
    const res = await testRest.post(app, route, categoryAdd, token);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(categ);
    return res.body;
};

beforeAll(async () => {
    await clearDatabase(await appInstance.databaseInstance);
    token = await shared.getTokenValid(usersAdd.joao, app);
    tokenAdmin = await shared.getTokenValid(usersAdd.admin, app);
});

describe('delete', () => {
    let categSaved: Category;

    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        categSaved = await postCategory(categoryAdd, tokenAdmin);
    });

    it.each(invalidIds)
    ('invalid',
      async (id, expectedStatus) => {
          const res = await testRest.delete(app, route, id, tokenAdmin);
          expect(res.status).toBe(expectedStatus);
      });

    it(
      'not_admin',
      async () => {
          const res = await testRest.delete(app, route, categSaved.id, token);
          expect(res.status).toBe(403);
          expect(res.body.message).toBe(serviceDataMsg.onlyAdmin().message);
      });

    it(
      'valid',
      async () => {
          const res = await testRest.delete(app, route, categSaved.id, tokenAdmin);
          expect(res.status).toBe(200);
          const resGetAfterDel = await testRest.getById(app, route, categSaved.id, tokenAdmin);
          expect(resGetAfterDel.status).toBe(404);
      });
});

describe('get_by_id', () => {
    let categSaved: Category;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        categSaved = await postCategory(categoryAdd, tokenAdmin);
    });

    it.each(invalidIds)
    ('invalid',
      async (id, expectedStatus) => {
          const res = await testRest.getById(app, route, id, token);
          expect(res.status).toBe(expectedStatus);
      });

    it(
      'valid',
      async () => {
          const res = await testRest.getById(app, route, categSaved.id, token);
          expect(res.status).toBe(200);
          expect(res.body).toMatchObject(categSaved);
      });
});

describe('get', () => {
    const filter: FilterCategory = {
        currentPage: 1,
        perPage: 10,
        text: 'deck'
    };
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(categoryAddList
          .map(async c => {
              const res = await testRest.post(app, route, c, tokenAdmin);
              expect(res.status).toBe(201);
          })
        );
    });

    it(
      'text_deck',
      async () => {
          const res = await testRest.get(app, route, filter, token);
          const categories: Category[] = res.body;
          expect(res.status).toBe(200);
          expect(categories.length).toBeTruthy();
          const allContaisText = categories.every(
            c => c.title
              .toLowerCase()
              .includes(filter.text)
          );
          expect(allContaisText).toBeTruthy();
      });

    it(
      'filter',
      async () => {
          const res = await testRest.get(app, route, { ...filter, perPage: 2 }, token);
          const body: Category[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length === 2);
          const allContainsText = body
            .every(c => c.title
              .toLowerCase()
              .includes(filter.text)
            );
          expect(allContainsText).toBeTruthy();
      });

    it(
      'no_text',
      async () => {
          const res = await testRest.get(app, route, { ...filter, text: '', currentPage: 1 }, token);
          const body: Category[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length === filter.perPage);
      });
});

describe('patch', () => {
    let categSaved: Category;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        categSaved = await postCategory(categoryAdd, tokenAdmin);
    });

    it.each<TestObject<CategoryAdd>>([
        {
            data: { title: '' },
            message: validationErrorMsg.empty('title'),
            expectStatus: 400
        },
        {
            data: { title: generators.getNCharText(categorySizes.titleMin - 1) },
            message: validationErrorMsg.minLen('title', categorySizes.titleMin),
            expectStatus: 400
        },
        {
            data: { title: generators.getNCharText(categorySizes.titleMax + 1) },
            message: validationErrorMsg.maxLen('title', categorySizes.titleMax),
            expectStatus: 400
        },
        ...invalidFieldsPatch
    ])
    ('invalid',
      async (test: TestObject<CategoryAdd>) => {
          const res = await testRest.patch(app, route, categSaved.id, test.data, tokenAdmin);
          expect(res.status).toBe(test.expectStatus);
          expect((res.body.message ?? res.body[0] as string).toLowerCase())
            .toBe(test.message.toLowerCase());
      });

    it(
      'not_admin',
      async () => {
          const res = await testRest.patch(app, route, categSaved.id, {}, token);
          expect(res.status).toBe(403);
          expect(res.body.message).toBe(serviceDataMsg.onlyAdmin().message);
      });

    it.each([{ 'title': 'new Title' }])
    ('valid', async (data) => {
        const res = await testRest.patch(app, route, categSaved.id, data, tokenAdmin);
        expect(res.status).toBe(200);

        const resGet = await testRest.getById(app, route, categSaved.id, token);
        expect(resGet.status).toBe(200);
        expect(resGet.body).toMatchObject(data);
    });
});

describe('post', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it('valid', async () => await postCategory(categoryAdd, tokenAdmin));

    it(
      'not_admin',
      async () => {
          const res = await testRest.post(app, route, {}, token);
          expect(res.status).toBe(403);
          expect(res.body.message).toBe(serviceDataMsg.onlyAdmin().message);
      });

    it.each<TestObject<CategoryAdd>>([
        {
            data: {},
            message: validationErrorMsg.empty('title'),
            expectStatus: 400
        },
        {
            data: { title: '' },
            message: validationErrorMsg.empty('title'),
            expectStatus: 400
        },
        {
            data: { title: null },
            message: validationErrorMsg.empty('title'),
            expectStatus: 400
        },
        {
            data: { title: undefined },
            message: validationErrorMsg.empty('title'),
            expectStatus: 400
        },
        {
            data: { title: generators.getNCharText(categorySizes.titleMin - 1) },
            message: validationErrorMsg.minLen('title', categorySizes.titleMin),
            expectStatus: 400
        },
        {
            data: { title: generators.getNCharText(categorySizes.titleMax + 1) },
            message: validationErrorMsg.maxLen('title', categorySizes.titleMax),
            expectStatus: 400
        }
    ] as TestObject<CategoryAdd>[])
    ('invalid',
      async (test: TestObject<CategoryAdd>) => {
          const res = await testRest.post(app, route, test.data, tokenAdmin);
          expect(res.status).toBe(test.expectStatus);
          expect((res.body[0] as string).toLowerCase())
            .toBe(test.message.toLowerCase());
      });
});
