'use strict';
import { IUser } from '../../src/domain/interfaces/user.interface';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';

const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;

const userRight: IUser = {
    email: 'gseis@gmail.com',
    name: 'Antônio',
    password: '12345678'
};

describe('User', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'Usuário vazio',
      async () => {
          const res = await request(app)
            .post('/user')
            .send({});
          expect(res.status).toBe(400);
      });

    it(
      'Usuário sem email, senha ou nome',
      async () => {
          const userEmpty = await request(app)
            .post('/user')
            .send({});
          expect(userEmpty.status).toBe(400);

          const userWithoutEmail = await request(app)
            .post('/user')
            .send({ ...userRight, email: null });
          expect(userWithoutEmail.status).toBe(400);

          const userWithoutName = await request(app)
            .post('/user')
            .send({ ...userRight, name: '' });
          expect(userWithoutName.status).toBe(400);

          const userWithoutPass = await request(app)
            .post('/user')
            .send({ ...userRight, password: '' });
          expect(userWithoutPass.status).toBe(400);
      });


    it(
      'Usuário com email duplicado',
      async () => {
          const res = await request(app)
            .post('/user')
            .send(userRight);
          expect(res.status).toBe(201);

          const resDuplicated = await request(app)
            .post('/user')
            .send(userRight);
          expect(resDuplicated.status).toBe(409);
      });

    it(
      'Usuário válido',
      async () => {
          const res = await request(app)
            .post('/user')
            .send(userRight);
          expect(res.status).toBe(201);
      });
});
