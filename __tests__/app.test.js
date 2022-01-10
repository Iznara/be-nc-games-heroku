const request = require('supertest');
const app = require('../app');

const seed = require('../db/seeds/seed.js');
const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => seed(testData));
afterAll(() => db.end());


describe('app handles all invalid urls', () => {
    test('status:404 - not found', async () => {
        const { body } = await request(app)
            .get('/vdfvdfv/svfvdfv')
            .expect(404);
        expect(body.msg).toBe('Route Not Found');
    });
});

describe('GET /api/categories', () => {
    test('status:200, responds with an array of \'categories\' objects', async () => {
        const { body } = await request(app)
            .get('/api/categories')
            .expect(200);
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

describe('GET /api/reviews/:review_id', () => {
    test('status:200, responds with a single review by its review_id', async () => {
        const { body } = await request(app)
            .get('/api/reviews/2')
            .expect(200);
        expect(body.review).toEqual(
            expect.objectContaining({
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
            })
        );
    });
    describe('Error Handling for GET /api/reviews/:review_id', () => {
        test('status:400 bad request - invalid syntax for :review_id', async () => {
            const { body } = await request(app)
                .get('/api/reviews/notanumber!')
                .expect(400);
            expect(body.msg).toBe('Bad Request');
        });
        test('status:404 not found - invalid review_id', async () => {
            const { body } = await request(app)
                .get('/api/reviews/1000')
                .expect(404);
            expect(body.msg).toBe('Review Not Found');
        });
    });
});

describe('PATCH /api/reviews/:review_id', () => {
    test('status:200 accepts a positive number of votes and returns the updated review', async () => {
        const { body } = await request(app)
            .patch(`/api/reviews/2`)
            .send({ "inc_votes": 1 })
            .expect(200);
        expect(body.review).toEqual(
            expect.objectContaining({
                review_id: 2,
                title: 'Jenga',
                review_body: 'Fiddly fun for all the family',
                designer: 'Leslie Scott',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                category: 'dexterity',
                owner: 'philippaclaire9',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: 6
            })
        );
    });
    test('status:200 accepts a negative number of votes and returns the updated review', async () => {
        const { body } = await request(app)
            .patch(`/api/reviews/2`)
            .send({ "inc_votes": -100 })
            .expect(200);
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
    test(`status:200 sends unchanged review if request body is empty`, async () => {
        const { body } = await request(app)
            .patch(`/api/reviews/2`)
            .send({})
            .expect(200);
        expect(body.review).toEqual(
            expect.objectContaining({
                review_id: 2,
                title: 'Jenga',
                review_body: 'Fiddly fun for all the family',
                designer: 'Leslie Scott',
                review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                category: 'dexterity',
                owner: 'philippaclaire9',
                created_at: '2021-01-18T10:01:41.251Z',
                votes: 5
            })
        );
    });
    describe('Error Handling for PATCH /api/reviews/:review_id', () => {
        test('status:400 bad request - invalid syntax for :review_id', async () => {
            const { body } = await request(app)
                .patch('/api/reviews/notanumber!')
                .expect(400);
            expect(body.msg).toBe('Bad Request');
        });
        test(`status:400 bad request - invalid data in request body`, async () => {
            const { body } = await request(app)
                .patch(`/api/reviews/2`)
                .send({ inc_votes: 'one' })
                .expect(400);
            expect(body.msg).toBe('Bad Request');
        })
    });
});

describe('GET /api/reviews', () => {
    test('status:200 returns all reviews descending by created_at by default', async () => {
        const { body } = await request(app)
            .get('/api/reviews')
            .expect(200);
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews).toHaveLength(13);
        expect(body.reviews).toBeSortedBy('created_at', { descending: true });
        body.reviews.forEach((review) => {
            expect(review).toEqual(
                expect.objectContaining({
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),

                    review_id: expect.any(Number),
                    comment_count: expect.any(Number),
                }));
        });
    });
    test('status:200 returns all reviews ascending by review_id', async () => {
        const { body } = await request(app)
            .get('/api/reviews?sort_by=review_id&&order=asc')
            .expect(200);
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews).toHaveLength(13);
        expect(body.reviews).toBeSortedBy('review_id', { descending: false });
        body.reviews.forEach((review) => {
            expect(review).toEqual(
                expect.objectContaining({
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),

                    review_id: expect.any(Number),
                    comment_count: expect.any(Number),
                }));
        });

    });
    test('status:200 returns reviews filtered by social_deduction category and descending by votes', async () => {
        const { body } = await request(app)
            .get('/api/reviews?category=social+deduction&&sort_by=votes&&order=desc')
            .expect(200);
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews).toHaveLength(11);
        expect(body.reviews).toBeSortedBy('votes', { descending: true });
        body.reviews.forEach((review) => {
            expect(review).toEqual(
                expect.objectContaining({
                    title: expect.any(String),
                    designer: expect.any(String),
                    owner: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    category: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),

                    review_id: expect.any(Number),
                    comment_count: expect.any(Number),
                }));
        });
    });
    test("status 200: returns an empty array for a valid category that has no reviews", () => {
        return request(app)
            .get("/api/reviews?category=children's+games")
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toEqual([]);
            });
    });
    describe('Error Handling for GET /api/reviews', () => {
        test("status:400 invalid query", async () => {
            const { body } = await request(app)
                .get("/api/reviews?eroifjier")
                .expect(400);
            expect(body.msg).toBe('Invalid Query');
        });
        test("status:400 invalid sort_by query", async () => {
            const { body } = await request(app)
                .get("/api/reviews?sort_by=bananas")
                .expect(400);
            expect(body.msg).toBe('Bad Request: Invalid column name');
        });
        test("status:400 invalid order query", async () => {
            const { body } = await request(app)
                .get("/api/reviews?sort_by=votes&&order=condescending")
                .expect(400);
            expect(body.msg).toBe('Bad Request: Order should be \'asc\' or \'desc\'');
        });
        test("status:404 invalid category - does not exist in database", async () => {
            const { body } = await request(app)
                .get("/api/reviews?category=notavalidcat")
                .expect(404);
            expect(body.msg).toBe('Category does not exist in the database');
        });
        // test("status:404 valid category but no reviews have been written", async () => {
        //     const { body } = await request(app)
        //         .get("/api/reviews?category=children's+games")
        //         .expect(404);
        //     expect(body.msg).toBe('No reviews found for this category');
        // });
    });
});

describe('GET /api/reviews/:review_id/comments', () => {
    test('status:200 returns an array of comments for the given review_id', async () => {
        const { body } = await request(app)
            .get('/api/reviews/2/comments')
            .expect(200);
        const comArr = body.comments.every((comment) => comment.review_id === 2);
        expect(body.comments).toHaveLength(3);
        expect(comArr).toBe(true);
    });
    test("status 200: returns an empty array for a review with no comments", () => {
        return request(app)
            .get("/api/reviews/1/comments")
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
            });
    });
    describe('Error Handling for GET /api/reviews/:review_id/comments', () => {
        test('status:400 bad request - invalid syntax for :review_id', async () => {
            const { body } = await request(app)
                .get('/api/reviews/banana/comments')
                .expect(400);
            expect(body.msg).toBe('Bad Request');
        });
        test("status 404 valid reviw_id but does not exist", () => {
            return request(app)
                .get("/api/reviews/1000/comments")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe("The review you are attempting to view does not exist");
                });
        });


    });
});

describe('POST /api/reviews/:review_id/comments', () => {
    test('status:201 returns the posted comment', async () => {
        const { body } = await request(app)
            .post('/api/reviews/1/comments')
            .send({ "username": "bainesface", "body": "I like turtles" })
            .expect(201);
        expect(body.comment).toMatchObject({
            body: 'I like turtles',
            votes: 0,
            author: 'bainesface',
            review_id: expect.any(Number),
            created_at: expect.any(String)
        });
    });
    describe('Error Handling for POST /api/reviews/:review_id/comments', () => {
        test('status:400 bad request - invalid syntax for :review_id', async () => {
            const { body } = await request(app)
                .get('/api/reviews/notanumber/comments')
                .send({ "username": "bainesface", "body": "I like turtles" })
                .expect(400);
            expect(body.msg).toBe('Bad Request');
        });
        test('status:400 bad request - empty request body', async () => {
            const { body } = await request(app)
                .post('/api/reviews/1/comments')
                .send({})
                .expect(400);
            expect(body.msg).toBe('Bad Request: NULL values not authorised');
        });
        test("status:422 unprocessable entity - Valid username but does not exist", () => {
            return request(app)
                .post("/api/reviews/1/comments")
                .send({ "username": "ryan", "body": "I also like turtles!" })
                .expect(422)
                .then(({ body }) => {
                    expect(body.msg).toBe("Bad Request: Data does not exist");
                });
        });
        test("status:422 unprocessable entity - Valid review_id but does not exist", () => {
            return request(app)
                .post("/api/reviews/1000/comments")
                .send({ "username": "bainesface", "body": "I don't like turtles!" })
                .expect(422)
                .then(({ body }) => {
                    expect(body.msg).toBe("Bad Request: Data does not exist");
                });
        });
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('status:204 returns with correct status and no content', async () => {
        await request(app)
            .delete('/api/comments/3')
            .expect(204);
        const { rows } = await db.query('SELECT * FROM comments');
        expect(rows.length).toBe(5);
    });
    describe('Error Handling for DELETE /api/comments/:comment_id', () => {
        test('status:400 invalid syntax for comment_id', async () => {
            const { body } = await request(app)
                .delete('/api/comments/notanumber')
                .expect(400);
            expect(body.msg).toBe('Bad Request');
        });
        test('status:404 valid comment_id but does not exist', async () => {
            const { body } = await request(app)
                .delete('/api/comments/1000')
                .expect(404);
            expect(body.msg).toBe('The comment you are attempting to delete does not exist');
        });
    });
});

describe('GET /api', () => {
    test('status: 200 responds with JSON describing all the available endpoints on the API', async () => {
        const endPointsData = require("../endpoints.json")
        const { body } = await request(app)
            .get('/api')
            .expect(200);
        expect(body.summary).toEqual(endPointsData);
    });
});

describe("GET /api/users", () => {
    test("status: 200 responds with an array of objects with a username property", async () => {
        const { body } = await request(app)
            .get('/api/users')
            .expect(200);
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
            expect(user).toEqual(
                expect.objectContaining({
                    username: expect.any(String),
                }));
        });
    });
});
