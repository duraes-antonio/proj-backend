'use strict';
import { App } from '../../../src/app';
import { ListAdd } from '../../../src/domain/models/lists-item/list';
import { EUserRole } from '../../../src/domain/enum/role';
import { clearDatabase } from '../../../utils/database';
import { generators } from '../../../utils/generators';
import { listSizes } from '../../../src/shared/fieldSize';
import { StringOptional, testRest } from '../../shared-methods-http';
import { cmp, invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../../shared-data';
import { Product, ProductAdd } from '../../../src/domain/models/product';

const appInstance = new App();
const app = appInstance.express;
const route = '/list-product';

const listProductAdd: ListAdd<Product> = {
    title: 'Produtos de teste - Cliente',
    readRole: EUserRole.CUSTOMER,
    itemsId: []
};
const listProductAddAdmin: ListAdd<Product> = {
    title: 'Produtos de teste - Admin',
    readRole: EUserRole.ADMIN,
    itemsId: []
};
const productAdd: ProductAdd = {
    title: 'Produto de teste',
    desc: 'Descrição de teste',
    price: 150,
    quantity: 100,
    percentOff: 10,
    freeDelivery: true,
    categoriesId: [],
    cost: 10,
    height: 1,
    length: 1,
    weight: 1,
    width: 1,
    visible: true
};

const invalidDataPatchPost: TestObject<object>[] = [
    ...sharedDataTest.getTestsForStringFields(['title'], listSizes),
    ...sharedDataTest.getTestsForListFields(['itemsId'], listSizes),
    ...sharedDataTest.getTestsForCheckEmptyFields('readRole', 400)
];
const validsListsAdd: ListAdd<Product>[] = [
    { ...listProductAdd, title: generators.getNCharText(64) },
    { ...listProductAdd, title: generators.getNCharText(2) },
    {
        ...listProductAdd,
        itemsId: [...Array(10)].map(() => generators.getMongoOBjectId())
    },
    { ...listProductAdd, readRole: EUserRole.UNKNOWN }
];
let token: string;
let tokenAdmin: string;

beforeAll(async () => {
    await clearDatabase(await appInstance.databaseInstance);
    token = await sharedDataTest.getTokenValid(usersAdd.joao, app);
    tokenAdmin = await sharedDataTest.getTokenValid(usersAdd.admin, app);
    const productId = (await testRest.post(app, '/product', productAdd, tokenAdmin)).body.id;
    listProductAdd.itemsId.push(productId);
    listProductAddAdmin.itemsId.push(productId);
});

describe('delete', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.deleteInvalidIds(app, route, id, status, tokenAdmin)
    );

    it('not_admin', async () => await testRest.deleteOnlyAdmin(app, route, token));

    it('valid', async () =>
      await testRest.postAndDelete(app, route, listProductAdd, tokenAdmin)
    );
});

describe('get', () => {
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all([listProductAdd, listProductAddAdmin]
          .map(async c => await testRest.postAndMatch(app, route, c, tokenAdmin))
        );
    });

    it('valid ', async () => {
        await testRest.getAndMatch(
          app, route, {}, [listProductAdd, listProductAddAdmin],
          tokenAdmin,
          (a: ListAdd<Product>, b: ListAdd<Product>) =>
            cmp(a, b, (obj: ListAdd<Product>) => obj.title)
        );
    });
});

describe('get_by_id', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.getByIdInvalidIds(app, route, id, status, tokenAdmin)
    );

    it('valid', async () =>
      await testRest.postAndGetById(app, route, listProductAdd, tokenAdmin)
    );
});

describe('patch', () => {
    const idValid = generators.getMongoOBjectId();

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.patchInvalidIds(app, route, id, status, tokenAdmin));

    it.each<TestObject<object>>([...invalidDataPatchPost, ...invalidFieldsPatch])
    ('invalid - %s', async (testCase) => {
        const res = await testRest.patch(app, route, idValid, testCase.data, tokenAdmin);
        expect(res.status).toBe(testCase.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(testCase.message.toLowerCase());
    });

    it('not_admin', async () => await testRest.patchOnlyAdmin(app, route, token));

    it.each<ListAdd<Product>>(validsListsAdd)
    ('valid - %s', async (dataPatch) =>
      await testRest.postAndPatch(app, route, listProductAdd, dataPatch, tokenAdmin)
    );
});

describe('post', () => {

    it.each<ListAdd<Product>>(validsListsAdd)
    ('valid ', async (listAdd) =>
      await testRest.postAndMatch(app, route, listAdd, tokenAdmin)
    );

    it.each<TestObject<object>>(invalidDataPatchPost)
    ('invalid - %s', async (test) => {
        const res = await testRest.post(app, route, { ...listProductAdd, ...test.data }, tokenAdmin, test.expectStatus);
        expect(res.body[0].toLowerCase()).toBe(test.message.toLowerCase());
    });
});
