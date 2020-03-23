'use strict';
import { IUser } from '../../src/domain/interfaces/user.interface';
import { App } from '../../src/app';
import { clearDatabase } from '../../utils/database';

const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;

const userRight: IUser = {
    createdAt: new Date(),
    email: 'gseis@gmail.com',
    name: 'Antônio',
    password: '12345678'
};

describe('Authentication', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'Without email',
      async () => {
          const res = await request(app)
            .post('/auth/authenticate')
            .send();
          expect(res.status).toBe(400);
      });

    it(
      'Without password',
      async () => {
          const res = await request(app)
            .post('/auth/authenticate')
            .send({ email: 'teste@gmail.com' });
          expect(res.status).toBe(400);
      });

    it(
      'Wrong password',
      async () => {
          const resUserCreated = await request(app)
            .post('/user')
            .send(userRight);
          expect(resUserCreated.status).toBe(201);

          const res = await request(app)
            .post('/auth/authenticate')
            .send({ ...userRight, password: '1234567' });
          expect(res.status).toBe(403);
      });

    it(
      'User inexistent',
      async () => {
          const res = await request(app)
            .post('/auth/authenticate')
            .send(userRight);
          expect(res.status).toBe(404);
      });

    it(
      'Valid user',
      async () => {
          const resUserCreated = await request(app)
            .post('/user')
            .send(userRight);
          expect(resUserCreated.status).toBe(201);

          const res = await request(app)
            .post('/auth/authenticate')
            .send(userRight);
          expect(res.status).toBe(200);
          expect(res.body.token).toBeTruthy();
      });
});

describe('Invalidate Token', () => {
    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'Invalid token',
      async () => {
          const resPostUser = await request(app)
            .post('/user')
            .send(userRight);
          expect(resPostUser.status).toBe(201);

          const validToken = resPostUser.body.token;
          const res = await request(app)
            .post('/auth/invalidate')
            .set('x-access-token', `${validToken + '1'}`);
          expect(res.status).toBe(401);
      });

    it(
      'Empty token',
      async () => {
          const resPostUser = await request(app)
            .post('/user')
            .send(userRight);
          expect(resPostUser.status).toBe(201);

          const res = await request(app)
            .post('/auth/invalidate');
          expect(res.status).toBe(401);
      });

    it(
      'Valid Token',
      async () => {
          const resPostUser = await request(app)
            .post('/user')
            .send(userRight);
          expect(resPostUser.status).toBe(201);

          const validToken = resPostUser.body.token;
          const res = await request(app)
            .post('/auth/invalidate')
            .set('x-access-token', `${validToken}`);
          expect(res.status).toBe(201);

          const resInvalid = await request(app)
            .post('/auth/invalidate')
            .set('x-access-token', `${validToken}`);
          expect(resInvalid.status).toBe(401);
      });
});

//
// async function refreshToken(req: Request, res: Response);
//
