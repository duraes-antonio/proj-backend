'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { Address, AddressAdd } from '../../src/domain/interfaces/address';
import { UserAdd } from '../../src/domain/interfaces/user';
import { EUserRole } from '../../src/domain/enum/role.enum';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;
const route = '/address';

const addrRight: AddressAdd = {
    city: 'Serra',
    neighborhood: 'JC',
    number: 38,
    state: 'Espírito Santo',
    street: 'Rua Nelson',
    zipCode: '28161788'
};
const addresses: AddressAdd[] = [
    { ...addrRight, zipCode: '28161788' },
    { ...addrRight, zipCode: '27485699' },
    { ...addrRight, zipCode: '21478599' },
    { ...addrRight, zipCode: '29161699' }
];
const user: UserAdd = {
    email: 'joao@teste.com',
    name: 'João',
    password: 'senha123',
    roles: [EUserRole.CUSTOMER]
};
const user2: UserAdd = {
    email: 'joao2@teste.com',
    name: 'João',
    password: 'senha123',
    roles: [EUserRole.CUSTOMER]
};

let token1: string, token2: string;

async function getTokenValid(user: UserAdd): Promise<string> {
    const resPostUser = await request(app)
      .post('/user')
      .send(user);
    expect(resPostUser.status).toBe(201);
    return resPostUser.body.token;
}

function cmp(a: Address | AddressAdd, b: Address | AddressAdd): number {
    if (a.zipCode < b.zipCode) {
        return -1;
    }
    if (a.zipCode > b.zipCode) {
        return 1;
    }
    return 0;
}

beforeAll(async () => {
    clearDatabase(await appInstance.databaseInstance);
    token1 = await getTokenValid(user);
    token2 = await getTokenValid(user2);
});

describe('post', () => {
    beforeEach(async () => {
        clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'empty',
      async () => {
          const res = await request(app)
            .post(route)
            .set('x-access-token', token1)
            .send({});
          expect(res.status).toBe(400);
      });

    it(
      'valid',
      async () => {
          const res = await request(app)
            .post(route)
            .set('x-access-token', token1)
            .send(addrRight);
          expect(res.status).toBe(201);
          const body: Address = res.body;
          expect(body).toMatchObject(addrRight);
      });
});

describe('patch', () => {
    let addressSaved: Address;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post(route)
          .set('x-access-token', token1)
          .send(addrRight);
        expect(res.status).toBe(201);
        addressSaved = res.body;
    });

    it.each([
        { 'invalidField': 4, 'city': 'validField' },
        { 'notExist': 'string' },
        { 'id': 'notAllowed' },
        { 'userId': 'notAllowed' }
    ])
    ('invalid_field',
      async (data) => {
          const res = await request(app)
            .patch(`${route}/${addressSaved.id}`)
            .set('x-access-token', token1)
            .send(data);
          expect(res.status).toBe(400);
      });

    it.each([
        { number: 42 },
        { zipCode: '29167666' },
        { street: 'New Street' },
        { neighborhood: 'Garden Carapina' },
        { city: 'Victory' },
        { state: 'Saint Spirit' },
        {
            number: 42,
            zipCode: '29167666',
            street: 'New Street',
            neighborhood: 'Garden Carapina',
            city: 'Victory',
            state: 'Saint Spirit'
        }
    ])
    ('valid',
      async (data) => {
          const res = await request(app)
            .patch(`${route}/${addressSaved.id}`)
            .set('x-access-token', token1)
            .send(data);
          const resGet = await request(app)
            .get(`${route}/${addressSaved.id}`)
            .set('x-access-token', token1)
            .send();
          console.log(resGet.body);
          expect(resGet.body).toMatchObject(data);
      });
});

describe('get', () => {
    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        await Promise.all(addresses
          .map(async a => {
              await request(app)
                .post(route)
                .set('x-access-token', token1)
                .send(a);
          })
        );
        await request(app)
          .post(route)
          .set('x-access-token', token2)
          .send(addrRight);
    });

    it(
      'valid',
      async () => {
          const res = await request(app)
            .get(route)
            .set('x-access-token', token1)
            .send();
          expect(res.status).toBe(200);
          expect((res.body as Address[]).length === addresses.length)
            .toBeTruthy();
          expect((res.body as Address[]).sort(cmp))
            .toMatchObject(addresses.sort(cmp));
      });
});

describe('get_by_id', () => {
    let addressSaved: Address;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        const res = await request(app)
          .post(route)
          .set('x-access-token', token1)
          .send(addrRight);
        expect(res.status).toBe(201);
        addressSaved = res.body;
    });

    it(
      'valid',
      async () => {
          const res = await request(app)
            .get(`${route}/${addressSaved.id}`)
            .set('x-access-token', token1)
            .send();
          expect(res.body).toMatchObject(addrRight);
      });
});

describe('delete', () => {

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
    });

    it('not_owner', async () => {
        const res = await request(app)
          .post(route)
          .set('x-access-token', token1)
          .send(addrRight);
        expect(res.status).toBe(201);
        const resDel = await request(app)
          .delete(`${route}/${res.body.id}`)
          .set('x-access-token', token2)
          .send();
        expect(resDel.status).toBe(404);
    });

    it('valid', async () => {
        const res = await request(app)
          .post(route)
          .set('x-access-token', token1)
          .send(addrRight);
        expect(res.status).toBe(201);
        const resDel = await request(app)
          .delete(`${route}/${res.body.id}`)
          .set('x-access-token', token1)
          .send();
        expect(resDel.status).toBe(200);
    });
});
