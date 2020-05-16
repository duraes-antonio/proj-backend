'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { Address, AddressAdd, AddressPatch } from '../../src/domain/models/address';
import { invalidFieldsPatch, invalidIds, sharedDataTest, TestObject, usersAdd } from '../shared-data';
import { StringOptional, testRest } from '../shared-methods-http';
import { validationErrorMsg } from '../../src/shared/buildMsg';
import { generators } from '../../utils/generators';
import { addressSizes } from '../../src/shared/consts/fieldSize';

const appInstance = new App();
const app = appInstance.express;
const route = '/address';

const addrRight: AddressAdd = {
    city: 'Serra',
    neighborhood: 'Jardim Nelson',
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
    tokenJoao = await sharedDataTest.getTokenValid(usersAdd.joao, app);
    tokenAdmin = await sharedDataTest.getTokenValid(usersAdd.admin, app);
});

describe('delete', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (id, status) =>
      await testRest.deleteInvalidIds(app, route, id, status, tokenAdmin)
    );

    it('not_owner', async () => {
        await testRest.deleteNotOwner(app, route, addrRight, tokenJoao, tokenAdmin);
    });

    it('valid', async () => {
        await testRest.postAndDelete(app, route, addrRight, tokenJoao);
    });
});

describe('get', () => {
    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(addresses
          .map(async a => await testRest.postAndMatch(app, route, a, tokenJoao))
        );
        await testRest.postAndMatch(app, route, addrRight, tokenAdmin);
    });

    it('valid', async () =>
      testRest.getAndMatch(app, route, {}, addresses, tokenJoao, cmp)
    );
});

describe('get_by_id', () => {

    it.each<[StringOptional, number]>(invalidIds)
    ('id = %s; status be %d', async (input, status) =>
      await testRest.getByIdInvalidIds(app, route, input, status, tokenAdmin)
    );

    it('valid', async () => await testRest.postAndGetById(app, route, addrRight, tokenJoao));
});

describe('patch', () => {
    const addressId = generators.getMongoOBjectId();

    it.each<TestObject<AddressPatch>>([
        ...sharedDataTest.getTestsForStringFields(['street', 'neighborhood', 'city'], addressSizes),
        ...sharedDataTest.getTestsForNumberFields(['number'], addressSizes),
        ...sharedDataTest.getTestForCustomStrFields(['zipCode'], addressSizes),
        {
            data: { state: '' },
            message: validationErrorMsg.empty('state'),
            expectStatus: 400
        },
        {
            data: { zipCode: '29161-699' },
            message: validationErrorMsg.invalidFormat('zipCode'),
            expectStatus: 400
        },
        ...invalidFieldsPatch
    ] as TestObject<AddressPatch>[])
    ('invalid_field %s',
      async (testCase) => {
          const res = await testRest.patch(app, route, addressId, testCase.data, tokenJoao);
          expect(res.status).toBe(testCase.expectStatus);
          expect((res.body.message ?? res.body[0] as string).toLowerCase())
            .toBe(testCase.message.toLowerCase());
      });

    it('not_owner', async () => {
        await testRest.patchNotOwner(app, route, addrRight, tokenJoao, tokenAdmin);
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
    ('valid %s',
      async (data) =>
        await testRest.postAndPatch(app, route, addrRight, data, tokenJoao)
    );
});

describe('post', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it('empty', async () =>
      await testRest.post(app, route, {}, tokenJoao, 400)
    );

    it('valid', async () => await testRest.postAndMatch(app, route, addrRight, tokenJoao));
});
