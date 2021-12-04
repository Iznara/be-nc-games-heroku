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
                .patch('/api/reviews/notanumber!')
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
        //Possibly status:422 unprocessable entity
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

describe('GET /api/reviews', () => {
    test('status:200 returns all reviews descending by created_at by default', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeInstanceOf(Array);
                expect(body.reviews).toHaveLength(13);
                expect(body.reviews).toBeSortedBy('created_at', { descending: true })
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
    });
    //Why does this test fail when sorted by title???
    //Works when queried on heroku but fails jest test
    test('status:200 returns all reviews ascending by review_id', () => {
        return request(app)
            .get('/api/reviews?sort_by=review_id&&order=asc')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeInstanceOf(Array);
                expect(body.reviews).toHaveLength(13);
                expect(body.reviews).toBeSortedBy('review_id', { descending: false })
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

    });
    //not working when queried on heroku - returns empty reviews array
    test('status:200 returns reviews filtered by social_deduction category and descending by votes', () => {
        return request(app)
            .get('/api/reviews?category=social+deduction&&sort_by=votes&&order=desc')
            .expect(200)
            .then(({ body }) => {
                expect(body.reviews).toBeInstanceOf(Array);
                expect(body.reviews).toHaveLength(11);
                expect(body.reviews).toBeSortedBy('votes', { descending: true })
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

    });

    describe('Error Handling for GET /api/reviews', () => {
        test("status:400 invalid query", () => {
            return request(app)
                .get("/api/reviews?eroifjier")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Invalid Query');
                });
        });

        test("status:400 invalid sort_by query", () => {
            return request(app)
                .get("/api/reviews?sort_by=bananas")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request: Invalid column name');
                });
        });

        test("status:400 invalid order query", () => {
            return request(app)
                .get("/api/reviews?sort_by=votes&&order=condescending")
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request: Order should be \'asc\' or \'desc\'');
                });
        });

        test("status:404 invalid category - does not exist in database", () => {
            return request(app)
                .get("/api/reviews?category=notavalidcat")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('Category does not exist in the database');
                    //supply msg with list of valid categories?
                });
        });

        test("status:404 valid category but no reviews have been written", () => {
            return request(app)
                .get("/api/reviews?category=children's+games")
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('No reviews found for this category');
                });
        });
    });
});

describe('GET /api/reviews/:review_id/comments', () => {
    test('status:200 returns an array of comments for the given review_id', () => {
        return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([
                    {
                        body: 'I loved this game too!',
                        votes: 16,
                        author: 'bainesface',
                        comment_id: 1,
                        created_at: '2017-11-22T12:43:33.389Z',
                        review_id: 2,
                    },
                    {
                        body: 'EPIC board game!',
                        votes: 16,
                        author: 'bainesface',
                        comment_id: 4,
                        created_at: '2017-11-22T12:36:03.389Z',
                        review_id: 2,
                    },
                    {
                        body: 'Now this is a story all about how, board games turned my life upside down',
                        votes: 13,
                        author: 'mallionaire',
                        comment_id: 5,
                        created_at: '2021-01-18T10:24:05.410Z',
                        review_id: 2,
                    },
                ]);
            });
    });
    describe('Error Handling for GET /api/reviews/:review_id/comments', () => {

        test('status:400 bad request - invalid syntax for :review_id', () => {
            return request(app)
                .get('/api/reviews/banana/comments')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request')
                });
        });

        test('status:404 not found - review_id is valid but not comment has yet been written', () => {
            return request(app)
                .get('/api/reviews/1/comments')
                .expect(404)
                .then(({ body }) => {
                    expect(body.msg).toBe('No comments found for this review')
                });
        });
    });
});

describe('POST /api/reviews/:review_id/comments', () => {
    test('status:201 returns the posted comment', () => {
        return request(app)
            .post('/api/reviews/1/comments')
            .send({ "username": "bainesface", "body": "I like turtles" })
            .expect(201)
            .then(({ body }) => {
                expect(body.comment).toMatchObject({
                    body: 'I like turtles',
                    votes: 0,
                    author: 'bainesface',
                    review_id: expect.any(Number),
                    created_at: expect.any(String)
                })
            })
    });

    describe('Error Handling for POST /api/reviews/:review_id/comments', () => {
        test('status:400 bad request - invalid syntax for :review_id', () => {
            return request(app)
                .get('/api/reviews/notanumber/comments')
                .send({ "username": "bainesface", "body": "I like turtles" })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request')
                });
        });

        test('status:400 bad request - username does not exist', () => {
            return request(app)
                .post('/api/reviews/1/comments')
                .send({ "username": "ryan", "body": "I also like turtles!" })
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request: Username does not exist')
                });
        });

        test('status:400 bad request - empty request body', () => {
            return request(app)
                .post('/api/reviews/1/comments')
                .send({})
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request: NULL values not authorised')
                });
        });
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('status:204 returns with correct status and no content', () => {
        return request(app)
            .delete('/api/comments/3')
            .expect(204)
            .then(() => {
                return db.query('SELECT * FROM comments')
            }).then(({ rows }) => {
                expect(rows.length).toBe(5)
                expect(rows).toEqual([
                    {
                        body: 'I loved this game too!',
                        votes: 16,
                        author: 'bainesface',
                        review_id: 2,
                        created_at: new Date(1511354613389),
                        comment_id: 1
                    },
                    {
                        body: 'My dog loved this game too!',
                        votes: 13,
                        author: 'mallionaire',
                        review_id: 3,
                        created_at: new Date(1610964545410),
                        comment_id: 2
                    },
                    {
                        body: 'EPIC board game!',
                        votes: 16,
                        author: 'bainesface',
                        review_id: 2,
                        created_at: new Date(1511354163389),
                        comment_id: 4
                    },
                    {
                        body: 'Now this is a story all about how, board games turned my life upside down',
                        votes: 13,
                        author: 'mallionaire',
                        review_id: 2,
                        created_at: new Date(1610965445410),
                        comment_id: 5
                    },
                    {
                        body: 'Not sure about dogs, but my cat likes to get involved with board games, the boxes are their particular favourite',
                        votes: 10,
                        author: 'philippaclaire9',
                        review_id: 3,
                        created_at: new Date(1616874588110),
                        comment_id: 6
                    }
                ]);
            });
    });
    describe('Error Handling for DELETE /api/comments/:comment_id', () => {
        test('status:400 invalid syntax for comment_id', () => {
            return request(app)
                .delete('/api/comments/notanumber')
                .expect(400)
                .then(({ body }) => {
                    expect(body.msg).toBe('Bad Request')
                });
        });
    });
});

describe('GET /api', () => {
    test('status:200 responds with JSON describing all the available endpoints on your API', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual(
                    {
                        summary: {
                            'GET /api': {
                                description: 'serves up a json representation of all the available endpoints of the api'
                            },
                            'GET /api/categories': {
                                description: 'serves an array of all categories',
                                queries: [],
                                exampleResponse: {
                                    categories: [
                                        {
                                            description: "Players attempt to uncover each other's hidden role",
                                            slug: "Social deduction"
                                        }
                                    ]
                                }
                            },
                            'GET /api/reviews': {
                                description: 'serves an array of all reviews',
                                queries: ["category", "sort_by", "order"],
                                exampleResponse: {
                                    reviews: [
                                        {
                                            title: "One Night Ultimate Werewolf",
                                            designer: "Akihisa Okui",
                                            owner: "happyamy2016",
                                            review_img_url: "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
                                            category: "hidden-roles",
                                            created_at: 1610964101251,
                                            votes: 5
                                        }
                                    ]
                                }
                            }
                        }
                    }
                );
            });
    });


});
