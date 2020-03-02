'use strict';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { IProduct } from '../../src/domain/interfaces/product.interface';
import { IUser } from '../../src/domain/interfaces/user.interface';

const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;

const userRight: IUser = {
    email: 'gseis@gmail.com',
    name: 'Antônio',
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
    categoriesId: ['a']
};

function getErrorRequest(res: any) {
    return JSON.parse(res['text']);
}

async function getTokenValid(user: IUser): Promise<string> {
    const resPostUser = await request(app)
      .post('/user')
      .send(user);
    return JSON.parse(resPostUser['text']).token;
}

describe('Authentication', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        token = await getTokenValid(userRight);
    });

    it(
      'True - Produto válido',
      async () => {
          const res = await request(app)
            .post('/product')
            .set('x-access-token', token)
            .send({ ...productValid });
          expect(res.status).toBe(200);
      });
});
