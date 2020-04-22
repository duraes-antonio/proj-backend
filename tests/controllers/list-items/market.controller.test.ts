'use strict';
import { App } from '../../../src/app';
import { clearDatabase } from '../../../utils/database';
import { invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../../shared-data';
import { testRest } from '../../shared-methods-http';
import { generators } from '../../../utils/generators';
import { FilterBasic } from '../../../src/domain/models/filters/filter-basic';
import { Market, MarketAdd } from '../../../src/domain/models/lists-item/market';
import { marketSizes } from '../../../src/shared/fieldSize';

const appInstance = new App();
const app = appInstance.express;
const route = '/market';

const marketAdd: MarketAdd = {
    avatarUrl: 'mercado-livre-avatar.jpeg',
    backgroundUrl: 'mercado-livre-background.jpeg',
    index: 1,
    name: 'Mercado Livre',
    url: 'https://www.mercadolivre.com'
};
const marketsAdd: MarketAdd[] = [
    {
        avatarUrl: 'mercado-livre-avatar.jpeg',
        backgroundUrl: 'mercado-livre-background.jpeg',
        index: 1,
        name: 'Mercado Livre',
        url: 'https://www.mercadolivre.com'
    },
    {
        avatarUrl: 'amazon-avatar.jpeg',
        backgroundUrl: 'amazon-background.jpeg',
        index: 1,
        name: 'Amazon',
        url: 'https://www.amazon.com'
    },
    {
        avatarUrl: 'americanas-avatar.jpeg',
        backgroundUrl: 'americanas-background.jpeg',
        index: 1,
        name: 'Americanas',
        url: 'https://www.americanas.com'
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
      await testRest.postAndDelete(app, route, marketAdd, tokenAdmin)
    );
});

describe('get', () => {
    const filter: FilterBasic = {
        currentPage: 1,
        perPage: 10
    };
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(marketsAdd
          .map(async c => await testRest.postAndMatch(app, route, c, tokenAdmin))
        );
    });

    it(
      'valid',
      async () => {
          const res = await testRest.get(app, route, filter, token);
          const body: Market[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length === marketsAdd.length);
      });
});

describe('patch', () => {
    const validId = generators.getMongoOBjectId() as string;

    it.each<TestObject<MarketAdd>>([
        ...sharedDataTest.getTestsForStringFields(
          ['avatarUrl', 'backgroundUrl', 'name', 'url'], marketSizes
        ),
        ...invalidFieldsPatch
    ])
    ('invalid', async (test: TestObject<MarketAdd>) => {
        const res = await testRest.patch(app, route, validId, test.data, tokenAdmin);
        expect(res.status).toBe(test.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(test.message.toLowerCase());
    });

    it('not_admin', async () => await testRest.patchOnlyAdmin(app, route, token));

    it.each([
        { avatarUrl: 'https://local.com/nova-foto.jpeg' },
        { backgroundUrl: 'https://local.com/novo-background.jpeg' },
        { name: 'Novo Nome da Loja' },
        { url: 'https://www.meu-novo-site.com.br' },
        { index: 0.5 }
    ])
    ('valid', async (dataPatch) =>
      await testRest.postAndPatch(app, route, marketAdd, dataPatch, tokenAdmin)
    );
});

describe('post', () => {

    it('valid', async () =>
      await testRest.post(app, route, marketAdd, tokenAdmin, 201)
    );

    it('not_admin', async () => await testRest.postOnlyAdmin(app, route, token));

    it.each<TestObject<object>>([
        ...sharedDataTest.getTestsForStringFields(
          ['avatarUrl', 'backgroundUrl', 'name', 'url'], marketSizes
        )
    ])
    ('invalid', async (test: TestObject<object>) => {
        const res = await testRest.post(app, route, { ...marketAdd, ...test.data }, tokenAdmin, test.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(test.message.toLowerCase());
    });
});
