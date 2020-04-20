'use strict';
import { App } from '../../src/app';
import { testRest } from '../shared-methods-http';
import { sharedDataTest, usersAdd } from '../shared-data';
import { clearDatabase } from '../../utils/database';

const appInstance = new App();
const app = appInstance.express;
const route = '/auth';
let token: string;

beforeAll(async () => {
    await clearDatabase(await appInstance.databaseInstance);
    token = await sharedDataTest.getTokenValid(usersAdd.joao, app);
});

describe('authenticate', () => {

    it.each([
        ['empty', {}, 400],
        ['no_email', { password: '123456' }, 400],
        ['no_password', { email: 'teste@gmail.com' }, 400],
        ['wrong_password', { ...usersAdd.joao, password: '1234567' }, 403],
        ['inexistent_user', { ...usersAdd.joao, email: 'inexistent@test.com' }, 404]
    ])
    ('invalid - %s', async (name, data, status) =>
      await testRest.post(app, `${route}/authenticate`, data, '', status)
    );

    it('valid', async () =>
      await testRest.post(app, `${route}/authenticate`, { ...usersAdd.joao }, '', 200)
    );
});

describe('invalidate_token', () => {
    const fullRoute = `${route}/signout`;

    it.each([
        ['malformed', `${token}1`, 401],
        ['empty', '', 401],
        ['empty', undefined, 401],
        ['empty', null, 401]
    ])
    ('invalid - %s - %s', async (name, data, status) =>
      await testRest.post(app, fullRoute, {}, data, status)
    );

    it('valid', async () => {
        await testRest.post(app, fullRoute, {}, token, 201);
        await testRest.post(app, fullRoute, {}, token, 401);
    });
});

describe('refresh_token', () => {
    const fullRoute = `${route}/refresh`;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it.each([
        ['malformed', `${token}1`, 401],
        ['empty', '', 401],
        ['empty', undefined, 401],
        ['empty', null, 401]
    ])
    ('invalid - %s - %s', async (name, data, status) =>
      await testRest.post(app, fullRoute, {}, data, status)
    );

    it('valid', async () => {
        const resRefresh = await testRest.post(app, fullRoute, {}, token, 201);
        const newToken = resRefresh.body.token;
        await testRest.post(app, fullRoute, {}, newToken, 201);
    });
});
