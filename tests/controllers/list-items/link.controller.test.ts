'use strict';
import { App } from '../../../src/app';
import { clearDatabase } from '../../../utils/database';
import { invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../../shared-data';
import { testRest } from '../../shared-methods-http';
import { generators } from '../../../utils/generators';
import { Link, LinkAdd } from '../../../src/domain/models/lists-item/link';
import { FilterBasic } from '../../../src/domain/models/filters/filter-basic';
import { linkSizes } from '../../../src/shared/fieldSize';

const appInstance = new App();
const app = appInstance.express;
const route = '/link';

const linkAdd: LinkAdd = {
    title: 'google',
    url: 'www.google.com'
};
const linksAdd: LinkAdd[] = [
    {
        title: 'google',
        url: 'www.google.com'
    },
    {
        title: 'loja',
        url: 'www.google.com/loja'
    },
    {
        title: 'sobre',
        url: 'www.google.com/sobre'
    }
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
      await testRest.postAndDelete(app, route, linkAdd, tokenAdmin)
    );
});

describe('get', () => {
    const filter: FilterBasic = {
        currentPage: 1,
        perPage: 10
    };
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(linksAdd
          .map(async c => await testRest.postAndMatch(app, route, c, tokenAdmin))
        );
    });

    it(
      'no_text',
      async () => {
          const res = await testRest.get(app, route, filter, token);
          const body: Link[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length === linksAdd.length);
      });
});

describe('patch', () => {
    const validId = generators.getMongoOBjectId() as string;

    it.each<TestObject<LinkAdd>>([
        ...sharedDataTest.getTestsForStringFields(['title', 'url'], linkSizes),
        ...invalidFieldsPatch
    ])
    ('invalid', async (test: TestObject<LinkAdd>) => {
        const res = await testRest.patch(app, route, validId, test.data, tokenAdmin);
        expect(res.status).toBe(test.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(test.message.toLowerCase());
    });

    it('not_admin', async () => await testRest.patchOnlyAdmin(app, route, token));

    it.each([{ 'title': 'new Title' }])
    ('valid', async (dataPatch) =>
      await testRest.postAndPatch(app, route, linkAdd, dataPatch, tokenAdmin)
    );
});

describe('post', () => {

    it('valid', async () =>
      await testRest.post(app, route, linkAdd, tokenAdmin, 201)
    );

    it('not_admin', async () => await testRest.postOnlyAdmin(app, route, token));

    it.each<TestObject<object>>([
        ...sharedDataTest.getTestsForStringFields(['title', 'url'], linkSizes)
    ])
    ('invalid', async (test: TestObject<object>) => {
        const res = await testRest.post(app, route, { ...linkAdd, ...test.data }, tokenAdmin, test.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(test.message.toLowerCase());
    });
});
