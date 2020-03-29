'use strict';
import { UserAdd } from '../../src/domain/interfaces/user.interface';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';
import { tokenService } from '../../src/services/tokenService';
import { EUserRole } from '../../src/domain/enum/role.enum';

const appInstance = new App();
const app = appInstance.express;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');

const userRight: UserAdd = {
    email: 'gseis@gmail.com',
    name: 'Antônio',
    password: '12345678',
    roles: [EUserRole.CUSTOMER]
};

describe('Post', () => {
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

describe('Get By Id', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'Usuário válido',
      async () => {

          const resCreate = await request(app)
            .post('/user')
            .send(userRight);
          expect(resCreate.status).toBe(201);

          const tokenData = await tokenService.decode(resCreate.body.token);

          const resGet = await request(app)
            .get(`/user/${tokenData.id}`)
            .send();

          expect(resGet.status).toBe(200);
      });

    it(
      'Usuário não existente',
      async () => {
          const resGet = await request(app)
            .get(`/user/${'12sdsadsa1d5sa1ds5d4ads'}`)
            .send();

          expect(resGet.status).toBe(400);
      });
});

/*TODO: Pensar na criação de patchs para atualizações*/
/*
describe('Put', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'Valid User',
      async () => {

          const resCreate = await request(app)
            .post('/user')
            .send(userRight);
          expect(resCreate.status).toBe(201);

          const tokenData = await tokenService.decode(resCreate.body.token);
          const resPut = await request(app)
            .put(`/user/${tokenData.id}`)
            .send({
                  avatarUrl: 'https:www.google.com',
                  name: 'Novo nome',
                  password: '87654321'
              }
            );
          expect(resPut.status).toBe(200);
      });

    it(
      'Invalid Id',
      async () => {
          const resGet = await request(app)
            .get(`/user/${'000000000000'}`)
            .send();
          expect(resGet.status).toBe(400);
      });
});
*/
