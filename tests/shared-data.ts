import { UserAdd } from '../src/domain/models/user';
import { EUserRole } from '../src/domain/enum/role.enum';
import { App } from '../src/app';
import request from 'supertest';
import { TestObject } from './test-object';
import { serviceDataMsg } from '../src/shared/buildMsg';

async function getTokenValid(user: UserAdd, app: App): Promise<string> {
    const resPostUser = await request(app)
      .post('/user')
      .send(user);
    expect(resPostUser.status).toBe(201);
    return resPostUser.body.token;
}

export const usersAdd = {
    admin: {
        email: 'joao@teste.com',
        name: 'João',
        password: '12345678',
        roles: [EUserRole.ADMIN]
    },
    joao: {
        email: 'admin@teste.com',
        name: 'Admin',
        password: '12345678',
        roles: [EUserRole.CUSTOMER]
    }
};
export const invalidIds: [any, number][] = [
    [null, 400],
    [undefined, 400],
    ['_', 400],
    ['8e1be7c2cc5369bc048e8d53', 404]
];
export const invalidFieldsPatch: TestObject<any>[] = [
    {
        data: { _id: '8e1be7c2cc5369bc048e8d53' },
        message: serviceDataMsg.fieldsInvalid(['_id']).message,
        expectStatus: 400
    },
    {
        data: { id: null },
        message: serviceDataMsg.fieldsInvalid(['id']).message,
        expectStatus: 400
    },
    {
        data: { inexist: null },
        message: serviceDataMsg.fieldsInvalid(['inexist']).message,
        expectStatus: 400
    }
];

export const shared = {
    getTokenValid
};
