'use strict';
import { App } from '../../../src/app';
import { ListAdd } from '../../../src/domain/models/lists-item/list';
import { EUserRole } from '../../../src/domain/enum/role';
import { clearDatabase } from '../../../utils/database';
import { generators } from '../../../utils/generators';
import { listSizes } from '../../../src/shared/fieldSize';
import { StringOptional, testRest } from '../../shared-methods-http';
import { cmp, invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../../shared-data';
import { Slide, SlideAdd } from '../../../src/domain/models/lists-item/slide';

const appInstance = new App();
const app = appInstance.express;
const route = '/list-slide';

const dataAdd: ListAdd<Slide> = {
    title: 'Lista de Teste',
    readRole: EUserRole.CUSTOMER,
    itemsId: []
};
const dataAddAdmin: ListAdd<Slide> = {
    title: 'Lista de Teste',
    readRole: EUserRole.ADMIN,
    itemsId: []
};

const invalidDataPatchPost: TestObject<object>[] = [
    ...sharedDataTest.getTestsForStringFields(['title'], listSizes),
    ...sharedDataTest.getTestsForListFields(['itemsId'], listSizes),
    ...sharedDataTest.getTestsForCheckEmptyFields('readRole', 400)
];
const validsListsAdd: ListAdd<Slide>[] = [
    { ...dataAdd, title: generators.getNCharText(64) },
    { ...dataAdd, title: generators.getNCharText(2) },
    {
        ...dataAdd,
        itemsId: [...Array(listSizes.itemsIdMax)].map(() => generators.getMongoOBjectId())
    },
    { ...dataAdd, readRole: EUserRole.UNKNOWN }
];
let token: string;
let tokenAdmin: string;

beforeAll(async () => {
    await clearDatabase(await appInstance.databaseInstance);
    token = await sharedDataTest.getTokenValid(usersAdd.joao, app);
    tokenAdmin = await sharedDataTest.getTokenValid(usersAdd.admin, app);
    const slideAdd: SlideAdd = {
        btnTitle: 'ver agora',
        desc: 'Promoção válida somente para os primeiros 150 clientes!',
        imageUrl: 'promocao-background.jpeg',
        index: 1,
        title: 'Promoção Corona - Card até 50% off',
        url: 'https://www.mercadolivre.com'
    };
    const slideId = (await testRest.post(app, '/slide', slideAdd, tokenAdmin)).body.id;
    dataAdd.itemsId.push(slideId);
    dataAddAdmin.itemsId.push(slideId);
});

describe('delete', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.deleteInvalidIds(app, route, id, status, tokenAdmin)
    );

    it('not_admin', async () => await testRest.deleteOnlyAdmin(app, route, token));

    it('valid', async () =>
      await testRest.postAndDelete(app, route, dataAdd, tokenAdmin)
    );
});

describe('get', () => {
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all([dataAdd, dataAddAdmin]
          .map(async c => await testRest.postAndMatch(app, route, c, tokenAdmin))
        );
    });

    it('valid ', async () => {
        await testRest.getAndMatch(
          app, route, {}, [dataAdd, dataAddAdmin], tokenAdmin,
          (a: ListAdd<Slide>, b: ListAdd<Slide>) =>
            cmp(a, b, (obj: ListAdd<Slide>) => obj.title)
        );
    });
});

describe('get_by_id', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.getByIdInvalidIds(app, route, id, status, tokenAdmin)
    );

    it('valid', async () =>
      await testRest.postAndGetById(app, route, dataAdd, tokenAdmin)
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

    it.each<ListAdd<Slide>>(validsListsAdd)
    ('valid - %s', async (dataPatch) =>
      await testRest.postAndPatch(app, route, dataAdd, dataPatch, tokenAdmin)
    );
});

describe('post', () => {

    it.each<ListAdd<Slide>>(validsListsAdd)
    ('valid ', async (listAdd) =>
      await testRest.postAndMatch(app, route, listAdd, tokenAdmin)
    );

    it.each<TestObject<object>>(invalidDataPatchPost)
    ('invalid - %s', async (test) => {
        const res = await testRest.post(app, route, { ...dataAdd, ...test.data }, tokenAdmin, test.expectStatus);
        expect(res.body[0].toLowerCase()).toBe(test.message.toLowerCase());
    });
});
