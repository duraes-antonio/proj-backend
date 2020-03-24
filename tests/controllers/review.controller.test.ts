'use strict';
import { App } from '../../src/app';
import { IReview } from '../../src/domain/interfaces/review.interface';
import { clearDatabase } from '../../utils/database';
import { EReviewSort, FilterReview } from '../../src/domain/models/filters/filterReview.model';
import { IUser } from '../../src/domain/interfaces/user.interface';

const request = require('supertest');
const appInstance = new App();
const app = appInstance.express;
const route = '/review';

const user: IUser = {
    createdAt: new Date(),
    email: 'gseis@gmail.com',
    name: 'Antônio',
    password: '12345678'
};
const payload: IReview = {
    comment: 'Teste de comentário',
    createdAt: new Date(),
    date: new Date(),
    productId: '5e768fc2176dedb9cee19e6e',
    rating: 4,
    title: 'Título da avaliação',
    userId: '5e768fc2176dedb9cee19e6e'
};
const reviews: IReview[] = [
    {
        ...payload, rating: 5, title: 'Breve resumo 1',
        date: new Date(2016, 2, 1)
    },
    {
        ...payload, rating: 1, title: 'Breve resumo 2',
        date: new Date(2019, 9, 1)
    },
    {
        ...payload, title: 'Breve resumo 3', rating: 4,
        date: new Date(2018, 5, 1)
    },
    {
        ...payload, title: 'Breve resumo 4', rating: 2,
        date: new Date(2017, 8, 1)
    },
    {
        ...payload, title: 'Breve resumo 5', rating: 5,
        date: new Date(2015, 2, 15)
    },
    {
        ...payload, rating: 1, title: 'Breve resumo 6',
        date: new Date(2016, 2, 1)
    },
    {
        ...payload, rating: 2, title: 'Breve resumo 7'
    },
    {
        ...payload, title: 'Breve resumo 8', rating: 4
    },
    {
        ...payload, title: 'Breve resumo 9', rating: 3
    },
    {
        ...payload, title: 'Breve resumo 10', rating: 2
    },
    {
        ...payload, title: 'Breve resumo 11', rating: 5
    },
    {
        ...payload, title: 'Breve resumo 12', rating: 5
    }
];
let token: string;

async function getTokenValid(user: IUser): Promise<string> {
    const resPostUser = await request(app)
      .post('/user')
      .send(user);
    expect(resPostUser.status).toBe(201);
    return resPostUser.body.token;
}

describe('post', () => {

    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        token = await getTokenValid(user);
    });

    it(
      'valid',
      async () => {
          const res = await request(app)
            .post(route)
            .set('x-access-token', token)
            .send({ ...payload });
          expect(res.status).toBe(201);
      });

    it('duplicated', async () => {
        const res = await request(app)
          .post(route)
          .set('x-access-token', token)
          .send({ ...payload });
        expect(res.status).toBe(201);

        const resDuplic = await request(app)
          .post(route)
          .set('x-access-token', token)
          .send({ ...payload });
        expect(resDuplic.status).toBe(409);
    });

    it.each([
        { ...payload, comment: '' },
        { ...payload, comment: 'inv len' },
        { ...payload, title: '' },
        { ...payload, title: 'inv len' },
        { ...payload, productId: null },
        { ...payload, userId: null },
        { ...payload, rating: -1 },
        { ...payload, rating: 6 }
    ] as IReview[])
    ('invalid',
      async (data: IReview) => {
          const res = await request(app)
            .post(route)
            .set('x-access-token', token)
            .send(data);
          expect(res.status).toBe(400);
      });
});

describe('delete', () => {

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        token = await getTokenValid(user);
    });

    it('valid', async () => {
        const resPost = await request(app)
          .post(route)
          .set('x-access-token', token)
          .send({ ...payload });
        expect(resPost.status).toBe(201);
        const review: IReview = resPost.body;

        const resDel = await request(app)
          .delete(`${route}/${review.id}`)
          .set('x-access-token', token)
          .send();
        expect(resDel.status).toBe(200);

        const resGet = await request(app)
          .get(route)
          .send();

        expect(!(resGet.body as IReview[]).length);
    });
});

/*
describe('put', () => {
    let review: IReview;

    beforeAll(async () => {
        clearDatabase(await appInstance.databaseInstance);
        token = await getTokenValid(user);
        const res = await request(app)
          .post(route)
          .set('x-access-token', token)
          .send({ ...payload });
        expect(res.status).toBe(201);
        review = res.body;
    });

    it('valid', async () => {
        const reviewPut = {
            title: '+new title',
            rating: 4,
            comment: 'new comment',
            productId: '7e768fc2176dedb9cee19e6e',
            userId: '8e768fc2176dedb9cee19e6e'
        };

        const resPut = await request(app)
          .put(`${route}/${review.id}`)
          .set('x-access-token', token)
          .send(reviewPut);
        expect(resPut.status).toBe(200);

        const resGet = await request(app)
          .get(route)
          .send();
        expect(!(resGet.body as IReview[]).length);
    });

    it.each([
        { ...payload, comment: '' },
        { ...payload, comment: 'inv len' },
        { ...payload, title: '' },
        { ...payload, title: 'inv len' },
        { ...payload, rating: -1 },
        { ...payload, rating: 6 }
    ] as IReview[])
    ('invalid', async (data) => {
        const resPut = await request(app)
          .put(`${route}/${review.id}`)
          .set('x-access-token', token)
          .send(data);
        expect(resPut.status).toBe(400);

        const resGet = await request(app)
          .get(route)
          .send();
        expect(!(resGet.body as IReview[]).length);
    });
});
*/

describe('get', () => {

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        token = await getTokenValid(user);
        await Promise.all(reviews
          .map(async r => {
              await request(app)
                .post(route)
                .set('x-access-token', token)
                .send(r);
          })
        );
    });

    it(
      'sort_rating_desc',
      async () => {
          const filter = new FilterReview();
          filter.sortBy = EReviewSort.RATING_HIGH;
          const res = await request(app)
            .get(route)
            .send(filter);

          const body: IReview[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length == filter.perPage).toBeTruthy();
          const hasGreat = body.some((v, i) =>
            body[i + 1] && v.rating < body[i + 1].rating
          );
          expect(hasGreat).toBeFalsy();
      });

    it(
      'sort_rating_asc',
      async () => {
          const filter = new FilterReview();
          filter.sortBy = EReviewSort.RATING_LOW;
          const res = await request(app)
            .get(route)
            .send(filter);

          const body: IReview[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length == filter.perPage).toBeTruthy();
          const hasGreat = body.some((v, i) =>
            body[i + 1] && v.rating > body[i + 1].rating
          );
          expect(hasGreat).toBeFalsy();
      });

    it(
      'sort_newest',
      async () => {
          const filter = new FilterReview();
          filter.sortBy = EReviewSort.NEWEST;
          const res = await request(app)
            .get(route)
            .send(filter);

          const body: IReview[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length == filter.perPage).toBeTruthy();
          const hasGreat = body.some((v, i) =>
            body[i + 1] && v.createdAt < body[i + 1].createdAt
          );
          expect(hasGreat).toBeFalsy();
      });

    it(
      'sort_oldest',
      async () => {
          const filter = new FilterReview();
          filter.sortBy = EReviewSort.OLDEST;
          const res = await request(app)
            .get(route)
            .send(filter);

          const body: IReview[] = res.body;
          expect(res.status).toBe(200);
          expect(body.length == filter.perPage).toBeTruthy();
          const hasGreat = body.some((v, i) =>
            body[i + 1] && v.createdAt > body[i + 1].createdAt
          );
          expect(hasGreat).toBeFalsy();
      });
});

