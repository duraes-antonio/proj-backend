'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { Address, AddressAdd, AddressPatch } from '../../src/domain/models/address';
import { invalidFieldsPatch, invalidIds, shared, usersAdd } from '../shared-data';
import { StringOptional, testRest } from '../shared-methods-http';
import { validationErrorMsg } from '../../src/shared/buildMsg';
import { generators } from '../../utils/generators';
import { addressSizes } from '../../src/shared/fieldSize';
import { TestObject } from '../test-object';

const appInstance = new App();
const app = appInstance.express;
const route = '/address';

const addrRight: AddressAdd = {
    city: 'Serra',
    neighborhood: 'JC',
    number: 38,
    state: 'ES',
    street: 'Rua Nelson',
    zipCode: '28161788'
};
const addresses: AddressAdd[] = [
    { ...addrRight, zipCode: '28161788' },
    { ...addrRight, zipCode: '27485699' },
    { ...addrRight, zipCode: '21478599' },
    { ...addrRight, zipCode: '29161699' }
];
let tokenJoao: string;
let tokenAdmin: string;

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
    await clearDatabase(await appInstance.databaseInstance);
    tokenJoao = await shared.getTokenValid(usersAdd.joao, app);
    tokenAdmin = await shared.getTokenValid(usersAdd.admin, app);
});

describe('delete', () => {

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it.each<[StringOptional, number]>(invalidIds)
    (
      'id = %s; status be %d',
      async (input, expected) => {
          const res = await testRest.delete(app, route, input, tokenAdmin);
          expect(res.status).toBe(expected);
      });

    it('not_owner', async () => {
        const res = await testRest.post(app, route, addrRight, tokenJoao);
        expect(res.status).toBe(201);
        const resDel = await testRest.delete(app, route, res.body.id, tokenAdmin);
        expect(resDel.status).toBe(404);
    });

    it('valid', async () => {
        const res = await testRest.post(app, route, addrRight, tokenJoao);
        expect(res.status).toBe(201);
        const resDel = await testRest.delete(app, route, res.body.id, tokenJoao);
        expect(resDel.status).toBe(200);
    });
});

describe('get', () => {
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(addresses
          .map(async a => {
              const res = await testRest.post(app, route, a, tokenJoao);
              expect(res.status).toBe(201);
          })
        );
        await testRest.post(app, route, addrRight, tokenAdmin);
    });

    it(
      'valid',
      async () => {
          const res = await testRest.get(app, route, {}, tokenJoao);
          expect(res.status).toBe(200);
          expect((res.body as Address[]).length).toBe(addresses.length);
          expect((res.body as Address[]).sort(cmp))
            .toMatchObject(addresses.sort(cmp));
      });
});

describe('get_by_id', () => {
    let addressSaved: Address;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await testRest.post(app, route, addrRight, tokenJoao);
        expect(res.status).toBe(201);
        addressSaved = res.body;
    });

    it.each<[StringOptional, number]>(invalidIds)
    (
      'id = %s; status be %d',
      async (input, expected) => {
          const res = await testRest.delete(app, route, input, tokenAdmin);
          expect(res.status).toBe(expected);
      });

    it(
      'valid',
      async () => {
          const res = await testRest.getById(app, route, addressSaved.id, tokenJoao);
          expect(res.body).toMatchObject(addrRight);
      });
});

describe('patch', () => {
    let addressSaved: Address;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await testRest.post(app, route, addrRight, tokenJoao);
        expect(res.status).toBe(201);
        addressSaved = res.body;
    });

    it.each<TestObject<AddressPatch>>([
        {
            data: { city: '' },
            message: validationErrorMsg.empty('city'),
            expectStatus: 400
        },
        {
            data: { city: generators.getNCharText(addressSizes.cityMin - 1) },
            message: validationErrorMsg.minLen('city', addressSizes.cityMin),
            expectStatus: 400
        },
        {
            data: { city: generators.getNCharText(addressSizes.cityMax + 1) },
            message: validationErrorMsg.maxLen('city', addressSizes.cityMax),
            expectStatus: 400
        },

        {
            data: { neighborhood: '' },
            message: validationErrorMsg.empty('neighborhood'),
            expectStatus: 400
        },
        {
            data: { neighborhood: generators.getNCharText(addressSizes.neighborhoodMin - 1) },
            message: validationErrorMsg.minLen('neighborhood', addressSizes.neighborhoodMin),
            expectStatus: 400
        },
        {
            data: { neighborhood: generators.getNCharText(addressSizes.neighborhoodMax + 1) },
            message: validationErrorMsg.maxLen('neighborhood', addressSizes.neighborhoodMax),
            expectStatus: 400
        },

        {
            data: { number: -1 },
            message: validationErrorMsg.minValue('number', addressSizes.numberMin),
            expectStatus: 400
        },
        {
            data: { number: addressSizes.numberMax + 1 },
            message: validationErrorMsg.maxValue('number', addressSizes.numberMax),
            expectStatus: 400
        },

        {
            data: { state: '' },
            message: validationErrorMsg.empty('state'),
            expectStatus: 400
        },
        {
            data: { state: generators.getNCharText(addressSizes.stateMin - 1) },
            message: validationErrorMsg.exactlyLen('state', addressSizes.stateMin),
            expectStatus: 400
        },
        {
            data: { state: generators.getNCharText(addressSizes.stateMax + 1) },
            message: validationErrorMsg.exactlyLen('state', addressSizes.stateMax),
            expectStatus: 400
        },

        {
            data: { street: '' },
            message: validationErrorMsg.empty('street'),
            expectStatus: 400
        },
        {
            data: { street: generators.getNCharText(addressSizes.streetMin - 1) },
            message: validationErrorMsg.minLen('street', addressSizes.streetMin),
            expectStatus: 400
        },
        {
            data: { street: generators.getNCharText(addressSizes.streetMax + 1) },
            message: validationErrorMsg.maxLen('street', addressSizes.streetMax),
            expectStatus: 400
        },

        {
            data: { zipCode: '' },
            message: validationErrorMsg.empty('zipCode'),
            expectStatus: 400
        },
        {
            data: { zipCode: generators.getNCharText(addressSizes.zipCodeMin) },
            message: validationErrorMsg.invalidFormat('zipCode'),
            expectStatus: 400
        },
        {
            data: { zipCode: '29161-699' },
            message: validationErrorMsg.invalidFormat('zipCode'),
            expectStatus: 400
        },
        ...invalidFieldsPatch
    ] as TestObject<AddressPatch>[])
    ('invalid_field',
      async (data) => {
          const res = await testRest.patch(app, route, addressSaved.id, data, tokenJoao);
          expect(res.status).toBe(400);
      });

    it.each([
        { number: 1541 },
        { zipCode: '29167666' },
        { street: 'Rua do Seu Jorge' },
        { neighborhood: 'Feu Rosa' },
        { city: 'Serra' },
        { state: 'ES' },
        {
            number: 42,
            zipCode: '29167666',
            street: 'Rua da Joana',
            neighborhood: 'Jardim Camburi',
            city: 'Vitória',
            state: 'ES'
        }
    ])
    ('valid',
      async (data) => {
          await testRest.patch(app, route, addressSaved.id, data, tokenJoao);
          const resGet = await testRest.getById(app, route, addressSaved.id, tokenJoao);
          expect(resGet.body).toMatchObject(data);
      });
});

describe('post', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'empty',
      async () => {
          const res = await testRest.post(app, route, {}, tokenJoao);
          expect(res.status).toBe(400);
      });

    it(
      'valid',
      async () => {
          const res = await testRest.post(app, route, addrRight, tokenJoao);
          expect(res.status).toBe(201);
          const body: Address = res.body;
          expect(body).toMatchObject(addrRight);
      });
});
