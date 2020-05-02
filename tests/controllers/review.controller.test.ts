'use strict';
import { App } from '../../src/app';
import { Review, ReviewAdd, ReviewPatch } from '../../src/domain/models/review';
import { clearDatabase } from '../../utils/database';
import { EReviewSort, FilterReview } from '../../src/domain/models/filters/filter-review';
import { serviceDataMsg, validationErrorMsg } from '../../src/shared/buildMsg';
import { generators } from '../../utils/generators';
import { reviewSizes } from '../../src/shared/fieldSize';
import { utilService } from '../../src/shared/util';
import { StringOptional, testRest } from '../shared-methods-http';
import { invalidIds, sharedDataTest, TestObject, usersAdd } from '../shared-data';

const appInstance = new App();
const app = appInstance.express;
const route = '/review';

const payload: ReviewAdd = {
    comment: 'Teste de comentário',
    productId: '5e768fc2176dedb9cee19e6e',
    rating: 4,
    title: 'Título da avaliação'
};
const reviews: ReviewAdd[] = [
    { ...payload, rating: 5, title: 'Breve resumo 1' },
    { ...payload, rating: 1, title: 'Breve resumo 2' },
    { ...payload, title: 'Breve resumo 3', rating: 4 },
    { ...payload, title: 'Breve resumo 4', rating: 2 },
    { ...payload, title: 'Breve resumo 5', rating: 5 },
    { ...payload, rating: 1, title: 'Breve resumo 6' },
    { ...payload, rating: 2, title: 'Breve resumo 7' },
    { ...payload, title: 'Breve resumo 8', rating: 4 },
    { ...payload, title: 'Breve resumo 9', rating: 3 },
    { ...payload, title: 'Breve resumo 10', rating: 2 },
    { ...payload, title: 'Breve resumo 11', rating: 5 },
    { ...payload, title: 'Breve resumo 12', rating: 5 }
];
let token: string;

beforeAll(async () => {
    await clearDatabase(await appInstance.databaseInstance);
    token = await sharedDataTest.getTokenValid(usersAdd.joao, app);
});

describe('delete', () => {

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it('valid', async () => {
        const resPost = await testRest.postAndMatch(app, route, payload, token);
        expect(resPost.status).toBe(201);
        const review: Review = resPost.body;

        const resDel = await testRest.delete(app, route, review.id, token);
        expect(resDel.status).toBe(200);

        const resGet = await testRest.getById(app, route, review.id, token);
        expect(resGet.status).toBe(404);
    });
});

describe('get', () => {
    const filter: FilterReview = {
        currentPage: 2,
        perPage: Math.floor(reviews.length / 2),
        sortBy: EReviewSort.NEWEST
    };
    type TestFilter = {
        filter: FilterReview;
        fnCheck: (reviews: Review[]) => boolean;
    };

    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        await Promise.all(reviews
          .map(async r => await testRest.postAndMatch(app, route, r, token))
        );
    });

    it.each<TestFilter>(
      [
          {
              filter: { ...filter, sortBy: EReviewSort.RATING_HIGH },
              fnCheck: (reviews): boolean => utilService.orderedDescending(reviews, (r) => r.rating)
          },
          {
              filter: { ...filter, sortBy: EReviewSort.RATING_LOW },
              fnCheck: (reviews): boolean => utilService.orderedAscending(reviews, (r) => r.rating)
          },
          {
              filter: { ...filter, sortBy: EReviewSort.OLDEST },
              fnCheck: (reviews): boolean => utilService.orderedAscending(reviews, (r) => r.date)
          },
          {
              filter: { ...filter },
              fnCheck: (reviews): boolean => utilService.orderedDescending(reviews, (r) => r.date)
          }
      ]
    )
    (
      'sort_by',
      async (testCase: TestFilter) => {
          const res = await testRest.get(app, route, testCase.filter, token);
          const reviews: Review[] = res.body;
          expect(res.status).toBe(200);
          expect(reviews.length == filter.perPage).toBeTruthy();
          expect(testCase.fnCheck(reviews)).toBeTruthy();
      });
});

describe('get_by_id', () => {
    let reviewSaved: Review;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await testRest.postAndMatch(app, route, payload, token);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(payload);
        reviewSaved = res.body;
    });

    it(
      'valid',
      async () => {
          const res = await testRest.getById(app, route, reviewSaved.id, token);
          expect(res.status).toBe(200);
          expect(res.body).toMatchObject(reviewSaved);
      });

    it.each<[StringOptional, number]>(invalidIds)
    (
      'invalid',
      async (id, status) => {
          const res = await testRest.getById(app, route, id, token);
          expect(res.status).toBe(status);
      });
});

describe('patch', () => {
    let reviewSaved: Review;

    beforeAll(async () => {
        await clearDatabase(await appInstance.databaseInstance);
        const res = await testRest.postAndMatch(app, route, payload, token);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(payload);
        reviewSaved = res.body;
    });

    it.each<ReviewPatch>([
        { comment: generators.getNCharText(reviewSizes.commentMin) },
        { comment: generators.getNCharText(reviewSizes.commentMax) },
        { title: generators.getNCharText(reviewSizes.titleMin) },
        { title: generators.getNCharText(reviewSizes.titleMax) },
        { rating: reviewSizes.ratingMin },
        { rating: reviewSizes.ratingMax }
    ])
    (
      'valid',
      async (review: ReviewPatch) => {
          const res = await testRest.patch(app, route, reviewSaved.id, review, token);
          expect(res.status).toBe(200);
          expect(res.body).toMatchObject(review);
      });

    it.each<TestObject<ReviewPatch | object>>([
        {
            data: { comment: '' },
            message: validationErrorMsg.empty('comment'),
            expectStatus: 400
        },
        {
            data: { comment: generators.getNCharText(reviewSizes.commentMin - 1) },
            message: validationErrorMsg.minLen('comment', reviewSizes.commentMin),
            expectStatus: 400
        },
        {
            data: { comment: generators.getNCharText(reviewSizes.commentMax + 1) },
            message: validationErrorMsg.maxLen('comment', reviewSizes.commentMax),
            expectStatus: 400
        },
        {
            data: { title: '' },
            message: validationErrorMsg.empty('title'),
            expectStatus: 400
        },
        {
            data: { title: generators.getNCharText(reviewSizes.titleMin - 1) },
            message: validationErrorMsg.minLen('title', reviewSizes.titleMin),
            expectStatus: 400
        },
        {
            data: { title: generators.getNCharText(reviewSizes.titleMax + 1) },
            message: validationErrorMsg.maxLen('title', reviewSizes.titleMax),
            expectStatus: 400
        },
        {
            data: { rating: reviewSizes.ratingMin - 1 },
            message: validationErrorMsg.minValue('rating', reviewSizes.ratingMin),
            expectStatus: 400
        },
        {
            data: { rating: reviewSizes.ratingMax + 1 },
            message: validationErrorMsg.maxValue('rating', reviewSizes.ratingMax),
            expectStatus: 400
        },
        {
            data: { productId: null },
            message: serviceDataMsg.fieldsInvalid(['productId']).message,
            expectStatus: 400
        },
        {
            data: { userId: '151515' },
            message: serviceDataMsg.fieldsInvalid(['userId']).message,
            expectStatus: 400
        },
        {
            data: { inexist: null },
            message: serviceDataMsg.fieldsInvalid(['inexist']).message,
            expectStatus: 400
        }
    ])
    ('invalid',
      async (test: TestObject<ReviewPatch>) => {
          const res = await testRest.patch(app, route, reviewSaved.id, test.data, token);
          expect(res.status).toBe(test.expectStatus);
          expect((res.body.message ?? res.body[0] as string).toLowerCase())
            .toBe(test.message.toLowerCase());
      });
});

describe('post', () => {

    beforeEach(async () => {
        await clearDatabase(await appInstance.databaseInstance);
    });

    it(
      'valid',
      async () => {
          const res = await testRest.postAndMatch(app, route, payload, token);
          expect(res.status).toBe(201);
          expect(res.body).toMatchObject(payload);
      });

    it('duplicated', async () => {
        const res = await testRest.postAndMatch(app, route, payload, token);
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(payload);

        const resDuplic = await testRest.post(app, route, payload, token, 409);
    });

    it.each<TestObject<ReviewAdd>>([
        {
            data: { ...payload, comment: '' },
            message: validationErrorMsg.empty('comment'),
            expectStatus: 400
        },
        {
            data: {
                ...payload,
                comment: generators.getNCharText(reviewSizes.commentMin - 1)
            },
            message: validationErrorMsg.minLen('comment', reviewSizes.commentMin),
            expectStatus: 400
        },
        {
            data: {
                ...payload,
                comment: generators.getNCharText(reviewSizes.commentMax + 1)
            },
            message: validationErrorMsg.maxLen('comment', reviewSizes.commentMax),
            expectStatus: 400
        },
        {
            data: { ...payload, title: '' },
            message: validationErrorMsg.empty('title'),
            expectStatus: 400
        },
        {
            data: {
                ...payload,
                title: generators.getNCharText(reviewSizes.titleMin - 1)
            },
            message: validationErrorMsg.minLen('title', reviewSizes.titleMin),
            expectStatus: 400
        },
        {
            data: {
                ...payload,
                title: generators.getNCharText(reviewSizes.titleMax + 1)
            },
            message: validationErrorMsg.maxLen('title', reviewSizes.titleMax),
            expectStatus: 400
        },
        {
            data: { ...payload, productId: null },
            message: validationErrorMsg.empty('productId'),
            expectStatus: 400
        },
        {
            data: { ...payload, rating: reviewSizes.ratingMin - 1 },
            message: validationErrorMsg.minValue('rating', reviewSizes.ratingMin),
            expectStatus: 400
        },
        {
            data: { ...payload, rating: reviewSizes.ratingMax + 1 },
            message: validationErrorMsg.maxValue('rating', reviewSizes.ratingMax),
            expectStatus: 400
        }
    ] as TestObject<ReviewAdd>[])
    ('invalid',
      async (test: TestObject<ReviewAdd>) => {
          const res = await testRest.post(app, route, test.data, token, test.expectStatus);
          expect((res.body[0] as string).toLowerCase())
            .toBe(test.message.toLowerCase());
      });
});
