'use strict';
import { App } from '../../../src/app';
import { ListAdd } from '../../../src/domain/models/lists-item/list';
import { Link, LinkAdd } from '../../../src/domain/models/lists-item/link';
import { EUserRole } from '../../../src/domain/enum/role.enum';
import { clearDatabase } from '../../../utils/database';
import { generators } from '../../../utils/generators';
import { listSizes } from '../../../src/shared/fieldSize';
import { StringOptional, testRest } from '../../shared-methods-http';
import { cmp, invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../../shared-data';

const appInstance = new App();
const app = appInstance.express;
const route = '/list-link';

const listLinkAdd: ListAdd<Link> = {
    title: 'Lista de Links',
    readRole: EUserRole.CUSTOMER,
    itemsId: []
};
const listLinkAddAdmin: ListAdd<Link> = {
    title: 'Lista de Links - Admin',
    readRole: EUserRole.ADMIN,
    itemsId: []
};

const invalidDataPatchPost: TestObject<object>[] = [
    ...sharedDataTest.getTestsForStringFields(['title'], listSizes),
    ...sharedDataTest.getTestsForListFields(['itemsId'], listSizes),
    ...sharedDataTest.getTestsForCheckEmptyFields('readRole', 400)
];
const validsListsAdd: ListAdd<Link>[] = [
    { ...listLinkAdd, title: generators.getNCharText(64) },
    { ...listLinkAdd, title: generators.getNCharText(2) },
    {
        ...listLinkAdd,
        itemsId: [...Array(10)].map(() => generators.getMongoOBjectId())
    },
    { ...listLinkAdd, readRole: EUserRole.UNKNOWN }
];
let token: string;
let tokenAdmin: string;

beforeAll(async () => {
    await clearDatabase(await appInstance.databaseInstance);
    token = await sharedDataTest.getTokenValid(usersAdd.joao, app);
    tokenAdmin = await sharedDataTest.getTokenValid(usersAdd.admin, app);
    const linkAdd: LinkAdd = { title: 'teste', url: 'www.google.com' };
    const linkId = (await testRest.post(app, '/link', linkAdd, tokenAdmin)).body.id;
    listLinkAdd.itemsId.push(linkId);
    listLinkAddAdmin.itemsId.push(linkId);
});

describe('delete', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.deleteInvalidIds(app, route, id, status, tokenAdmin)
    );

    it('not_admin', async () => await testRest.deleteOnlyAdmin(app, route, token));

    it('valid', async () =>
      await testRest.postAndDelete(app, route, listLinkAdd, tokenAdmin)
    );
});

describe('get', () => {
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all([listLinkAdd, listLinkAddAdmin]
          .map(async c => await testRest.postAndMatch(app, route, c, tokenAdmin))
        );
    });

    it('valid ', async () => {
        await testRest.getAndMatch(
          app, route, {}, [listLinkAdd, listLinkAddAdmin], tokenAdmin,
          (a: ListAdd<Link>, b: ListAdd<Link>) =>
            cmp(a, b, (obj: ListAdd<Link>) => obj.title)
        );
    });
});

describe('get_by_id', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.getByIdInvalidIds(app, route, id, status, tokenAdmin)
    );

    it('valid', async () =>
      await testRest.postAndGetById(app, route, listLinkAdd, tokenAdmin)
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

    it.each<ListAdd<Link>>(validsListsAdd)
    ('valid - %s', async (dataPatch) =>
      await testRest.postAndPatch(app, route, listLinkAdd, dataPatch, tokenAdmin)
    );
});

describe('post', () => {

    it.each<ListAdd<Link>>(validsListsAdd)
    ('valid ', async (listAdd) =>
      await testRest.postAndMatch(app, route, listAdd, tokenAdmin)
    );

    it.each<TestObject<object>>(invalidDataPatchPost)
    ('invalid - %s', async (test) => {
        const res = await testRest.post(app, route, { ...listLinkAdd, ...test.data }, tokenAdmin, test.expectStatus);
        expect(res.body[0].toLowerCase()).toBe(test.message.toLowerCase());
    });
});
