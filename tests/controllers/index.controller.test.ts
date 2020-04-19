'use strict';
import { App } from '../../src/app';
import { testRest } from '../shared-methods-http';

const appInstance = new App();
const app = appInstance.express;

describe('Root Controller', () => {
    it('Ping',
      async () => {
          const res = await testRest.get(app, '/', {});
          expect(res.status).toBe(200);
      });
});
