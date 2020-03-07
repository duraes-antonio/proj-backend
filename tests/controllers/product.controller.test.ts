'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { IProduct } from '../../src/domain/interfaces/product.interface';
import { IUser } from '../../src/domain/interfaces/user.interface';

const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;

const userRight: IUser = {
    email: `teste_@teste.com`,
    name: 'Tester',
    password: '12345678'
};

let token: string;

const productValid: IProduct = {
    title: 'Produto de teste',
    desc: 'Descrição',
    price: 150,
    amountAvailable: 100,
    percentOff: 10,
    avgReview: 3,
    freeDelivery: true,
    categoriesId: []
};

async function getTokenValid(user: IUser): Promise<string> {
    const resPostUser = await request(app)
      .post('/user')
      .send(user);
    expect(resPostUser.status).toBe(201);
    return resPostUser.body.token;
}

describe('POST', () => {
    beforeAll(async () => {
        token = await getTokenValid(userRight);
    });

    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'True - Produto válido',
      async () => {
          const res = await request(app)
            .post('/product')
            .set('x-access-token', token)
            .send({ ...productValid });
          expect(res.status).toBe(201);
      });
});
