const request = require('supertest');
const app = require('../app');

const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('app handles all invalid urls', () => {
    test('status:404 invalid route', () => {
        return request(app)
            .get('/vdfvdfv/svfvdfv')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Route not found');
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

});


// GET /api/reviews/:review_id
// PATCH /api/reviews/:review_id
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