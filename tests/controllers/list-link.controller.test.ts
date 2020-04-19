'use strict';
import { App } from '../../src/app';
import { List, ListAdd } from '../../src/domain/models/lists/list';
import { Link } from '../../src/domain/models/link';
import { EUserRole } from '../../src/domain/enum/role.enum';
import { clearDatabase } from '../../utils/database';
import { generators } from '../../utils/generators';
import { validationErrorMsg } from '../../src/shared/buildMsg';
import { listSizes } from '../../src/shared/fieldSize';
import { TestObject } from '../test-object';
import { testRest } from '../shared-methods-http';
import { shared, usersAdd } from '../shared-data';

const appInstance = new App();
const app = appInstance.express;
const route = '/list-link';

const listLinkAdd: ListAdd<Link> = {
    title: 'Card',
    readRole: EUserRole.CUSTOMER,
    itemsId: ['5e9a786985ff75870dbce86e', '5e9a7881d5c53cd9dd5e14ed']
};
const listLinkAddAdmin: ListAdd<Link> = {
    title: 'Card',
    readRole: EUserRole.ADMIN,
    itemsId: ['5e9a788e45612d9fc24957a6', '5e9a789696f26819054aa3fd']
};

const invalidDataPatchPost: TestObject<ListAdd<Link | object>>[] = [
    {
        data: { ...listLinkAdd, title: generators.getNCharText(65) },
        expectStatus: 400,
        message: validationErrorMsg.maxLen('title', listSizes.titleMax)
    },
    {
        data: { ...listLinkAdd, title: generators.getNCharText(1) },
        expectStatus: 400,
        message: validationErrorMsg.minLen('title', listSizes.titleMin)
    },
    {
        data: {
            ...listLinkAdd,
            itemsId: Array(11).map(() => generators.getMongoOBjectId())
        },
        expectStatus: 400,
        message: validationErrorMsg.maxLenList('itemsId', listSizes.lengthMax)
    },
    {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        data: { ...listLinkAdd, readRole: null },
        expectStatus: 400,
        message: validationErrorMsg.empty('readRole')
    }
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

beforeAll(async () => {
    token = await shared.getTokenValid(usersAdd.admin, app);
});

describe('delete', () => {
    let listSaved: List<Link>;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await testRest.post(app, route, listLinkAdd, token);
        expect(res.status).toBe(201);
        listSaved = res.body;
        expect(listSaved).toMatchObject(listLinkAdd);
    });

    it('valid ', async () => {
        const res = await testRest.delete(app, route, listSaved.id, token);
        expect(res.status).toBe(200);
        const resGet = await testRest.getById(app, route, listSaved.id, token);
        expect(resGet.status).toBe(404);
    });

    // TODO testar com ids inválidos
});

describe('get', () => {
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all([listLinkAdd, listLinkAddAdmin]
          .map(async c => {
              const res = await testRest.post(app, route, c, token);
              expect(res.status).toBe(201);
          })
        );
    });

    it('valid ', async () => {
        const resGet = await testRest.get(app, route, {}, token);
        expect(resGet.status).toBe(200);
        expect(resGet.body).toMatchObject([listLinkAdd, listLinkAddAdmin]);
    });
});

describe('get_by_id', () => {
    let listSaved: List<Link>;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await testRest.post(app, route, listLinkAdd, token);
        expect(res.status).toBe(201);
        listSaved = res.body;
        expect(listSaved).toMatchObject(listLinkAdd);
    });

    it('valid ', async () => {
        const res = await testRest.getById(app, route, listSaved.id, token);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(listSaved);
    });


    // TODO testar com ids inválidos
});

describe('patch', () => {
    let listAddSavedId: string;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await testRest.post(app, route, listLinkAdd, token);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(listLinkAdd);
        listAddSavedId = res.body.id;
    });

    it.each<ListAdd<Link>>(validsListsAdd)
    ('valid ', async (listAdd) => {
        const res = await testRest.patch(app, route, listAddSavedId, listAdd, token);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(listAdd);
    });

    it.each<TestObject<ListAdd<Link | object>>>(invalidDataPatchPost)
    ('invalid ', async (test: TestObject<ListAdd<Link | object>>) => {
        const res = await testRest.patch(app, route, listAddSavedId, test.data, token);
        expect(res.status).toBe(test.expectStatus);
        expect(res.body[0].toLowerCase()).toBe(test.message.toLowerCase());
    });
});

describe('post', () => {
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it.each<ListAdd<Link>>(validsListsAdd)
    ('valid ', async (listAdd) => {
        const res = await testRest.post(app, route, listAdd, token);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(listAdd);
    });

    it.each<TestObject<ListAdd<Link | object>>>(invalidDataPatchPost)
    ('invalid ', async (test) => {
        const res = await testRest.post(app, route, test.data, token);
        expect(res.status).toBe(test.expectStatus);
        expect(res.body[0].toLowerCase()).toBe(test.message.toLowerCase());
    });
});

