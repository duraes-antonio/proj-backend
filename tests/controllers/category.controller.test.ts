'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { Category, CategoryAdd } from '../../src/domain/models/category';
import { FilterCategory } from '../../src/domain/models/filters/filter-category';
import { categorySizes } from '../../src/shared/consts/fieldSize';
import { invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../shared-data';
import { testRest } from '../shared-methods-http';
import { generators } from '../../utils/generators';

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

beforeAll(async () => {
    await clearDatabase(await appInstance.databaseInstance);
    token = await sharedDataTest.getTokenValid(usersAdd.joao, app);
    tokenAdmin = await sharedDataTest.getTokenValid(usersAdd.admin, app);
});

describe('delete', () => {
    it.each(invalidIds)
    ('invalid - %s', async (id, expectedStatus) =>
      await testRest.deleteInvalidIds(app, route, id, expectedStatus, tokenAdmin)
    );

    it('not_admin', async () =>
      await testRest.deleteOnlyAdmin(app, route, token)
    );

    it('valid', async () =>
      await testRest.postAndDelete(app, route, categoryAdd, tokenAdmin)
    );
});

describe('get_by_id', () => {

    it.each(invalidIds)
    ('invalid - %s', async (id, expectedStatus) =>
      await testRest.getByIdInvalidIds(app, route, id, expectedStatus, tokenAdmin)
    );

    it('valid', async () =>
      await testRest.postAndGetById(app, route, categoryAdd, tokenAdmin)
    );
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
          .map(async c => await testRest.postAndMatch(app, route, c, tokenAdmin))
        );
    });

    it('text_deck', async () => {
        const res = await testRest.get(app, route, filter, token);
        const categories: Category[] = res.body;
        expect(res.status).toBe(200);
        expect(categories.length).toBeTruthy();
        const allContaisText = categories.filter(
          c => c.title
            .toLowerCase()
            .includes(filter.text)
        );
        expect(allContaisText).toMatchObject(res.body);
        const resCount = await testRest.get(app, `${route}/count`, filter, token);
        expect(resCount.body.data).toBe(allContaisText.length);
    });

    it(
      'filter',
      async () => {
          const newFilter = { ...filter };
          const res = await testRest.get(app, route, newFilter, token);
          const body: Category[] = res.body;
          expect(res.status).toBe(200);
          const allContainsText = body
            .filter(c => c.title
              .toLowerCase()
              .includes(newFilter.text)
            );
          expect(allContainsText).toMatchObject(res.body);
          const resCount = await testRest.get(app, `${route}/count`, newFilter, token);
          expect(resCount.body.data).toBe(allContainsText.length);
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
    const validId = generators.getMongoOBjectId() as string;

    it.each<TestObject<CategoryAdd>>([
        ...sharedDataTest.getTestsForStringFields(['title'], categorySizes),
        ...invalidFieldsPatch
    ])
    ('invalid', async (test: TestObject<CategoryAdd>) => {
        const res = await testRest.patch(app, route, validId, test.data, tokenAdmin);
        expect(res.status).toBe(test.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(test.message.toLowerCase());
    });

    it('not_admin', async () => await testRest.patchOnlyAdmin(app, route, token));

    it.each([{ 'title': 'new Title' }])
    ('valid', async (dataPatch) =>
      await testRest.postAndPatch(app, route, categoryAdd, dataPatch, tokenAdmin)
    );
});

describe('post', () => {

    it('valid', async () =>
      await testRest.post(app, route, categoryAdd, tokenAdmin, 201)
    );

    it('not_admin', async () => await testRest.postOnlyAdmin(app, route, token));

    it.each<TestObject<object>>([
        ...sharedDataTest.getTestsForStringFields(['title'], categorySizes)
    ])
    ('invalid', async (test: TestObject<object>) => {
        const res = await testRest.post(app, route, test.data, tokenAdmin, test.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(test.message.toLowerCase());
    });
});
