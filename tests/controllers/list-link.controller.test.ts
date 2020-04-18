'use strict';
import { App } from '../../src/app';
import { List, ListAdd } from '../../src/domain/models/lists/list';
import { Link } from '../../src/domain/models/link';
import { EUserRole } from '../../src/domain/enum/role.enum';
import { clearDatabase } from '../../utils/database';
import { generators } from '../../utils/generators';
import * as request from 'supertest';
import { validationErrorMsg } from '../../src/shared/buildMsg';
import { listSizes } from '../../src/shared/fieldSize';
import { TestObject } from '../test-object';

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
const invalidDataPatchPost: TestObject<ListAdd<Link>>[] = [
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

const closeConnection = (): void => {
    appInstance.databaseInstance.then((db) => {
        db.disconnect();
    });
};

afterAll(async () => {
    closeConnection();
});

describe('delete', () => {
    let listSaved: List<Link>;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post(route)
          .send(listLinkAdd);
        expect(res.status).toBe(201);
        listSaved = res.body;
        expect(listSaved).toMatchObject(listLinkAdd);
    });

    it('valid ', async () => {
        const res = await request(app)
          .delete(`${route}/${listSaved.id}`)
          .send();
        expect(res.status).toBe(200);
        const resGet = await request(app)
          .get(`${route}/${listSaved.id}`)
          .send();
        expect(resGet.status).toBe(404);
    });
});

describe('get', () => {
    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        await Promise.all([listLinkAdd, listLinkAddAdmin]
          .map(async c => {
              const res = await request(app)
                .post(route)
                .send(c);
              expect(res.status).toBe(201);
          })
        );
    });

    it('valid ', async () => {
        const resGet = await request(app)
          .get(route)
          .send();
        expect(resGet.status).toBe(200);
        expect(resGet.body).toMatchObject([listLinkAdd, listLinkAddAdmin]);
    });
});

describe('get_by_id', () => {
    let listSaved: List<Link>;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post(route)
          .send(listLinkAdd);
        expect(res.status).toBe(201);
        listSaved = res.body;
        expect(listSaved).toMatchObject(listLinkAdd);
    });

    it('valid ', async () => {
        const res = await request(app)
          .get(`${route}/${listSaved.id}`)
          .send();
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(listSaved);
    });
});

describe('patch', () => {
    let listAddSavedId: string;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post(route)
          .send(listLinkAdd);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(listLinkAdd);
        listAddSavedId = res.body.id;
    });

    it.each<ListAdd<Link>>(validsListsAdd)
    ('valid ', async (listAdd) => {
        const res = await request(app)
          .patch(`${route}/${listAddSavedId}`)
          .send(listAdd);
        expect(res.status).toBe(200);
        expect(res.body).toMatchObject(listAdd);
    });

    it.each<TestObject<ListAdd<Link>>>(invalidDataPatchPost)
    ('invalid ', async (test) => {
        const res = await request(app)
          .patch(`${route}/${listAddSavedId}`)
          .send(test.data);
        expect(res.status).toBe(test.expectStatus);
        expect(res.body[0].toLowerCase()).toBe(test.message.toLowerCase());
    });
});

describe('post', () => {
    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
    });

    it.each<ListAdd<Link>>(validsListsAdd)
    ('valid ', async (listAdd) => {
        const res = await request(app)
          .post(route)
          .send(listAdd);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(listAdd);
    });

    it.each<TestObject<ListAdd<Link>>>(invalidDataPatchPost)
    ('invalid ', async (test) => {
        const res = await request(app)
          .post(route)
          .send(test.data);
        expect(res.status).toBe(test.expectStatus);
        expect(res.body[0].toLowerCase()).toBe(test.message.toLowerCase());
    });
});

