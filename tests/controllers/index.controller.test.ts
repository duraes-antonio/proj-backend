'use strict';
import { App } from '../../src/app';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;

describe('Root Controller', () => {
    it(
      'Ping',
      async () => {
          const res = await request(app)
            .get('/')
            .send({});
          expect(res.status).toBe(200);
      });
});
