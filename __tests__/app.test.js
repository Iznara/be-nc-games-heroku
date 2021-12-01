const request = require('supertest');
const app = require('../app');

const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('app handles all invalid urls', () => {
    test('status:404 - not found', () => {
        return request(app)
            .get('/vdfvdfv/svfvdfv')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Route Not Found');
            });
    });
});

describe('GET /api/categories', () => {
    test('status:200, responds with an array of \'categories\' objects', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then(({ body }) => {
                expect(body.categories).toBeInstanceOf(Array);
                expect(body.categories).toHaveLength(4);
                body.categories.forEach((category) => {
                    expect(category).toEqual(
                        expect.objectContaining({
                            slug: expect.any(String),
                            description: expect.any(String)
                        }));
                });
            });
    });
});

describe('GET /api/reviews/:review_id', () => {
    test('status:200, responds with a single review by its review_id', () => {
        return request(app)
            .get('/api/reviews/2')
            .expect(200)
            .then(({ body }) => {
                expect(body.review).toEqual({
                    review_id: 2,
                    comment_count: 3,
                    title: 'Jenga',
                    designer: 'Leslie Scott',
                    owner: 'philippaclaire9',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    review_body: 'Fiddly fun for all the family',
                    category: 'dexterity',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 5
                });
            });
    });
    describe('Error Handling for GET /api/reviews/:review_id', () => {
        test('status:400 bad request - invalid syntax for :review_id', () => {
            return request(app)
                .get('/api/reviews/notanumber!')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request')
                });
        });
    });
});

describe('PATCH /api/reviews/:review_id', () => {
    test('status:200 accepts a positive number of votes and returns the updated review', () => {
        return request(app)
            .patch(`/api/reviews/2`)
            .send({ "inc_votes": 1 })
            .expect(200)
            .then(({ body }) => {
                expect(body.review).toEqual({
                    review_id: 2,
                    title: 'Jenga',
                    review_body: 'Fiddly fun for all the family',
                    designer: 'Leslie Scott',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    category: 'dexterity',
                    owner: 'philippaclaire9',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: 6
                });
            });
    });
    test('status:200 accepts a negative number of votes and returns the updated review', () => {
        return request(app)
            .patch(`/api/reviews/2`)
            .send({ "inc_votes": -100 })
            .expect(200)
            .then(({ body }) => {
                expect(body.review).toEqual({
                    review_id: 2,
                    title: 'Jenga',
                    review_body: 'Fiddly fun for all the family',
                    designer: 'Leslie Scott',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    category: 'dexterity',
                    owner: 'philippaclaire9',
                    created_at: '2021-01-18T10:01:41.251Z',
                    votes: -95
                });
            });
    });

    describe('Error Handling for PATCH /api/reviews/:review_id', () => {
        test('status:400 bad request - invalid syntax for :review_id', () => {
            return request(app)
                .get('/api/reviews/notanumber!')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request')
                });
        });
        test(`status:400 bad request - empty request body`, () => {
            return request(app)
                .patch(`/api/reviews/2`)
                .send({})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request');
                });
        });
        test(`status:400 bad request - invalid data in request body`, () => {
            return request(app)
                .patch(`/api/reviews/2`)
                .send({ inc_votes: 'one' })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request');
                })
        })
    });
});

// GET /api/reviews
// GET /api/reviews/:review_id/comments
// POST /api/reviews/:review_id/comments
// DELETE /api/comments/:comment_id
// GET /api

// 200 OK
// 201 Created
// 204 No Content
// 400 Bad Request
// 404 Not Found
// 405 Method Not Allowed
// 418 I'm a teapot
// 422 Unprocessable Entity
// 500 Internal Server Error