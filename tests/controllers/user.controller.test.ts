'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { StringOptional, testRest } from '../shared-methods-http';
import { invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../shared-data';
import { userSizes } from '../../src/shared/fieldSize';

const appInstance = new App();
const app = appInstance.express;
const route = '/user';
const usersValid = [usersAdd.admin, usersAdd.joao, usersAdd.maria];
const invalidDataPatchPost = [
    ...sharedDataTest.getTestsForStringFields(['name', 'password'], userSizes)
];

describe('get', () => {
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(usersValid
          .map(async u => await testRest.post(app, route, u, '', 201))
        );
    });

    it('valid ', async () =>
      await testRest.getAndMatch(
        app, route, {},
        usersValid.map(u => {
            const clone = { ...u };
            delete clone['password'];
            return clone;
        })
      )
    );
});

describe('get_by_id', () => {

    beforeAll(async () => await clearDatabase(await appInstance.databaseInstance));

    it('valid', async () => {
        const resPost = await testRest.post(app, route, usersAdd.joao, '', 201);
        const cloneExpected = { ...usersAdd.joao };
        delete cloneExpected['password'];
        expect(resPost.body.user).toMatchObject(cloneExpected);
    });

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.getByIdInvalidIds(app, route, id, status)
    );
});

describe('patch', () => {
    let idValid: string;
    let token: string;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await testRest.post(app, route, usersAdd.joao);
        token = res.body.token;
        idValid = res.body.user.id;
    });

    it.each<TestObject<object>>([...invalidDataPatchPost, ...invalidFieldsPatch])
    ('invalid - %s', async (testCase) => {
        const res = await testRest.patch(app, route, idValid, testCase.data, token);
        expect(res.status).toBe(testCase.expectStatus);
        expect((res.body.message ?? res.body[0] as string).toLowerCase())
          .toBe(testCase.message.toLowerCase());
    });

    it.each<any>([
        { password: '123456ab' },
        { name: 'Marcos da Silva' }
    ])
    ('valid - %s: %s', async (dataPatch) => {
        const resPatch = await testRest.patch(app, route, idValid, dataPatch, token);
        const cloneExpected = { ...usersAdd.joao, ...dataPatch };
        delete cloneExpected['password'];
        expect(resPatch.body).toMatchObject(cloneExpected);
    });
});

describe('post', () => {
    beforeEach(async () => await clearDatabase(await appInstance.databaseInstance));

    it.each<TestObject<object>>(invalidDataPatchPost)
    ('invalid - %s', async (test) => {
        const res = await testRest.post(
          app, route, { ...usersAdd.joao, ...test.data }, '', test.expectStatus
        );
        expect(res.body[0].toLowerCase()).toBe(test.message.toLowerCase());
    });

    it('duplicated', async () => await testRest.postDuplicated(app, route, usersAdd.joao));

    it('valid ', async () => {
        const resPost = await testRest.post(app, route, usersAdd.joao);
        const cloneExpected = { ...usersAdd.joao };
        delete cloneExpected['password'];
        expect(resPost.body.user).toMatchObject(cloneExpected);
    });
});
