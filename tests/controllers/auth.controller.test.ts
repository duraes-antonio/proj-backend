// 'use strict';
// import { IUser } from '../../src/domain/interfaces/user.interface';
// import { App } from '../../src/app';
// import { clearDatabase } from '../../utils/database';
//
// const request = require('supertest');
// const appInstance = new App();
// const app = appInstance.express;
//
// const userRight: IUser = {
//     email: 'gseis@gmail.com',
//     name: 'Antônio',
//     password: '12345678'
// };
//
// describe('Authentication', () => {
//     beforeEach(async () => {
//         await clearDatabase(await appInstance.databaseInstance);
//     });
//
//     it(
//       'Usuário sem email',
//       async () => {
//           const res = await request(app)
//             .post('/auth/authenticate')
//             .send({});
//           expect(res.status).toBe(400);
//       });
//
//     it(
//       'Usuário com email válido, sem senha',
//       async () => {
//           const res = await request(app)
//             .post('/auth/authenticate')
//             .send({ email: 'teste@gmail.com' });
//           expect(res.status).toBe(400);
//       });
//
//     it(
//       'Usuário válido, mas senha incorreta',
//       async () => {
//           const resUserCreated = await request(app)
//             .post('/user')
//             .send(userRight);
//           expect(resUserCreated.status).toBe(201);
//
//           const res = await request(app)
//             .post('/auth/authenticate')
//             .send({ ...userRight, password: '1234567' });
//           expect(res.status).toBe(403);
//       });
//
//     it(
//       'Usuário válido, mas não existente',
//       async () => {
//           const res = await request(app)
//             .post('/auth/authenticate')
//             .send(userRight);
//           expect(res.status).toBe(404);
//       });
//
//     it(
//       'True - Usuário válido',
//       async () => {
//           const resUserCreated = await request(app)
//             .post('/user')
//             .send(userRight);
//           expect(resUserCreated.status).toBe(201);
//
//           const res = await request(app)
//             .post('/auth/authenticate')
//             .send(userRight);
//           expect(res.status).toBe(200);
//           expect(JSON.parse(res['text']).token).toBeTruthy();
//       });
// });
//
// describe('Invalidate Token', () => {
//     beforeEach(async () => {
//         await clearDatabase(await appInstance.databaseInstance);
//     });
//
//     it(
//       'Token inicial inválido',
//       async () => {
//           const resPostUser = await request(app)
//             .post('/user')
//             .send(userRight);
//           expect(resPostUser.status).toBe(201);
//
//           const validToken = JSON.parse(resPostUser['text']).token;
//           const res = await request(app)
//             .post('/auth/invalidate')
//             .set('x-access-token', `${validToken + '1'}`);
//           expect(res.status).toBe(401);
//       });
//
//     it(
//       'True - Token inicial válido',
//       async () => {
//           const resPostUser = await request(app)
//             .post('/user')
//             .send(userRight);
//
//           expect(resPostUser.status).toBe(201);
//
//           const validToken = JSON.parse(resPostUser['text']).token;
//
//           const res = await request(app)
//             .post('/auth/invalidate')
//             .set('x-access-token', `${validToken}`);
//
//           expect(res.status).toBe(200);
//
//           const resInvalid = await request(app)
//             .post('/auth/invalidate')
//             .set('x-access-token', `${validToken}`);
//
//           expect(resInvalid.status).toBe(401);
//       });
// });
//
// //
// // async function refreshToken(req: Request, res: Response);
// //
