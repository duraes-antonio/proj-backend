'use strict';
import { App } from '../../src/app';
import { List, ListAdd } from '../../src/domain/interfaces/lists/list';
import { Link } from '../../src/domain/interfaces/link';
import { EUserRole } from '../../src/domain/enum/role.enum';
import { clearDatabase } from '../../utils/database';
import { generators } from '../../utils/generators';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');
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

describe('post', () => {
    let listSaved: List<Link>;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
    });

    it('valid ', async () => {
        const res = await request(app)
          .post(route)
          .send(listLinkAdd);
        expect(res.status).toBe(201);
        listSaved = res.body;
        expect(listSaved).toMatchObject(listLinkAdd);
    });

    it.each<TestObject<ListAdd<Link>>>([
        {
            data: {
                title: generators.getNCharText(65),
                itemsId: [generators.getMongoOBjectId()],
                readRole: EUserRole.UNKNOWN
            },
            expectStatus: 400
        },
        {
            data: {
                title: generators.getNCharText(1),
                itemsId: [generators.getMongoOBjectId()],
                readRole: EUserRole.UNKNOWN
            },
            expectStatus: 400
        },
        {
            data: {
                title: generators.getNCharText(1),
                itemsId: [generators.getMongoOBjectId()],
                readRole: null
            },
            expectStatus: 400
        }
    ] as TestObject<List<Link>>[])
    ('invalid ', async (test) => {
        const res = await request(app)
          .post(route)
          .send(test.data);
        expect(res.status).toBe(test.expectStatus);
        listSaved = res.body;
        expect(listSaved).toMatchObject(listLinkAdd);
    });
});


export interface TestObject<T> {
    data: T;
    expectStatus: number;
    message?: string;
}
