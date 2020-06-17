/*
'use strict';
import { App } from '../../../src/app';
import { clearDatabase } from '../../../utils/database';
import { invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../../shared-data';
import { testRest } from '../../shared-methods-http';
import { generators } from '../../../utils/generators';
import { FilterBasic } from '../../../src/domain/models/filters/filter-basic';
import { Slide, SlideInput } from '../../../src/domain/models/lists-item/slide';
import { slideSizes } from '../../../src/shared/consts/fieldSize';

const appInstance = new App();
const app = appInstance.express;
const route = '/slide';

const slideAdd: SlideInput = {
    btnTitle: 'ver agora',
    desc: 'Promoção válida somente para os primeiros 150 clientes!',
    imageUrl: 'promocao-background.jpeg',
    index: 1,
    title: 'Promoção Corona - Card até 50% off',
    url: 'https://www.mercadolivre.com'
};
const slidesAdd: SlideInput[] = [
    {
        btnTitle: 'ver agora',
        desc: 'Promoção válida somente para os primeiros 150 clientes!',
        imageUrl: 'promocao-background.jpeg',
        index: 1,
        title: 'Promoção Corona - Card até 50% off',
        url: 'https://www.mercadolivre.com'
    },
    {
        btnTitle: 'comprar',
        desc: 'Promoção válida somente até 22/05/2020!',
        imageUrl: 'promocao-ferias-background.jpeg',
        index: 2,
        title: 'Promoção Quarentina: Action Figures com até 30% off!',
        url: 'https://www.urldaloja.com'
    },
    {
        btnTitle: 'ir para loja',
        desc: 'Promoção válida somente para os primeiros 150 clientes!',
        imageUrl: 'promocao-background.jpeg',
        index: 3,
        title: '15% Off nos pacotes de cards acima de R$100',
        url: 'https://www.url-com-filtro.com'
    },
    {
        btnTitle: 'visualizar',
        desc: 'Promoção válida somente para os curtidores da fanpage da loja!',
        imageUrl: 'imagem-promocao.jpeg',
        index: 4,
        title: 'Promoção surpresa!',
        url: 'https://www.url-promo.com'
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
      await testRest.postAndDelete(app, route, slideAdd, tokenAdmin)
    );
});

describe('get', () => {
    const filter: FilterBasic = {
        currentPage: 1,
        perPage: 10
    };
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(slidesAdd
          .map(async c => await testRest.postAndMatch(app, route, c, tokenAdmin))
        );
    });

    it(
      'valid',
      async () => {
          const res = await testRest.get(app, route, filter, token);
          const body: Slide[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length === slidesAdd.length);
      });
});

describe('patch', () => {
    const validId = generators.getMongoOBjectId() as string;

    it.each<TestObject<SlideInput>>([
        ...sharedDataTest.getTestsForStringFields(
          ['btnTitle', 'desc', 'imageUrl', 'title', 'url'], slideSizes
        ),
        ...invalidFieldsPatch
    ])
    ('invalid', async (test: TestObject<SlideInput>) => {
        const res = await testRest.patch(app, route, validId, test.data, tokenAdmin);
        expect(res.status).toBe(test.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(test.message.toLowerCase());
    });

    it('not_admin', async () => await testRest.patchOnlyAdmin(app, route, token));

    it.each([
        { btnTitle: 'visualizar' },
        { desc: 'Promoção válida somente para os curtidores da fanpage da loja!' },
        { imageUrl: 'imagem-promocao.jpeg' },
        { index: 4 },
        { title: 'Promoção surpresa!' },
        { url: 'https://www.url-promo.com' }
    ])
    ('valid', async (dataPatch) =>
      await testRest.postAndPatch(app, route, slideAdd, dataPatch, tokenAdmin)
    );
});

describe('post', () => {

    it('valid', async () =>
      await testRest.post(app, route, slideAdd, tokenAdmin, 201)
    );

    it('not_admin', async () => await testRest.postOnlyAdmin(app, route, token));

    it.each<TestObject<object>>([
        ...sharedDataTest.getTestsForStringFields(
          ['btnTitle', 'desc', 'imageUrl', 'title', 'url'], slideSizes
        )
    ])
    ('invalid', async (test: TestObject<object>) => {
        const res = await testRest.post(app, route, { ...slideAdd, ...test.data }, tokenAdmin, test.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(test.message.toLowerCase());
    });
});
*/
