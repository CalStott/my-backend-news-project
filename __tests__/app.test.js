const endpointsJson = require('../endpoints.json');
const {
	topicData,
	userData,
	articleData,
	commentData,
} = require('../db/data/test-data/index');
const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe('GET /api', () => {
	test('200: Responds with an object detailing the documentation for each endpoint', () => {
		return request(app)
			.get('/api')
			.expect(200)
			.then(({ body: { endpoints } }) => {
				expect(endpoints).toEqual(endpointsJson);
			});
	});
	test('404: Responds with an error message when passed an invalid url', () => {
		return request(app)
			.get('/not-a-url')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Not found');
			});
	});

	describe('GET /api/topics', () => {
		test('200: Responds with an array of topic objects containing slug and description keys', () => {
			return request(app)
				.get('/api/topics')
				.expect(200)
				.then(({ body: { topics } }) => {
					expect(topics).toHaveLength(3);
					topics.forEach((topic) => {
						expect(topic).toMatchObject({
							description: expect.any(String),
							slug: expect.any(String),
						});
					});
				});
		});
	});

	describe('GET /api/articles/:article_id', () => {
		test('200: Responds with an object detailing the information for the specified article', () => {
			return request(app)
				.get('/api/articles/2')
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article).toMatchObject({
						article_id: 2,
						author: expect.any(String),
						title: expect.any(String),
						body: expect.any(String),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
					});
				});
		});
		test('404: Responds with an error message when passed a valid url parameter but there is no content there', () => {
			return request(app)
				.get('/api/articles/9046')
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Not found');
				});
		});
		test('400: Responds with an error message when passed an invalid url parameter', () => {
			return request(app)
				.get('/api/articles/dog')
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
	});

	describe('GET /api/articles', () => {
		test('200: Responds with an array of article objects including comment count key and no body key', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toHaveLength(13);
					expect(articles).toBeSortedBy('created_at', { descending: true });
					articles.forEach((article) => {
						expect(article).toMatchObject({
							article_id: expect.any(Number),
							author: expect.any(String),
							title: expect.any(String),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							article_img_url: expect.any(String),
							comment_count: expect.any(Number),
						});
					});
				});
		});
		describe('GET /api/articles?queries', () => {
			test('200: Should correctly sort the data by the input sort query', () => {
				return request(app)
					.get('/api/articles?sort_by=votes')
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toHaveLength(13);
						expect(articles).toBeSortedBy('votes', {
							descending: true,
							coerce: true,
						});
					});
			});
			test('400: Responds with error message when passed invalid sort query', () => {
				return request(app)
					.get('/api/articles?sort_by=very_wrong_sort')
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					});
			});
			test('200: Should correctly order the data by the input order query', () => {
				return request(app)
					.get('/api/articles?order=asc')
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toHaveLength(13);
						expect(articles).toBeSortedBy('created_at');
					});
			});
			test('400: Responds with error message when passed invalid order query', () => {
				return request(app)
					.get('/api/articles?order=entropy')
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					});
			});
			test('200: Should correctly sort and order the data by the input sort and order queries', () => {
				return request(app)
					.get('/api/articles?sort_by=author&order=asc')
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toHaveLength(13);
						expect(articles).toBeSortedBy('author');
					});
			});
		});
	});

	describe('GET /api/articles/:article_id/comments', () => {
		test('200: Responds with an array of comment objects for the input article id', () => {
			return request(app)
				.get('/api/articles/3/comments')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).toHaveLength(2);
					expect(comments).toBeSortedBy('created_at', { descending: true });
					comments.forEach((comment) => {
						expect(comment).toMatchObject({
							comment_id: expect.any(Number),
							body: expect.any(String),
							article_id: 3,
							author: expect.any(String),
							votes: expect.any(Number),
							created_at: expect.any(String),
						});
					});
				});
		});
		test('200: Responds with status code and empty array when article id exists but there is no content to present', () => {
			return request(app)
				.get('/api/articles/2/comments')
				.expect(200)
				.then(({ body: { comments } }) => {
					expect(comments).toEqual([]);
				});
		});
		test('404: Responds with an error message when passed a valid url parameter but there is no content', () => {
			return request(app)
				.get('/api/articles/4836/comments')
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Not found');
				});
		});
		test('400: Responds with an error message when passed an invalid url parameter', () => {
			return request(app)
				.get('/api/articles/recipes/comments')
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
	});

	describe('GET /api/users', () => {
		test('200: Responds with an array of users', () => {
			return request(app)
				.get('/api/users')
				.expect(200)
				.then(({ body: { users } }) => {
					expect(users).toHaveLength(4);
					users.forEach((user) => {
						expect(user).toMatchObject({
							username: expect.any(String),
							name: expect.any(String),
							avatar_url: expect.any(String),
						});
					});
				});
		});
	});
});

describe('POST /api/articles/:article_id/comments', () => {
	test('201: Responds with posted comment', () => {
		const testComment = {
			username: 'butter_bridge',
			body: '60% of the time it works 100% of the time',
		};
		return request(app)
			.post('/api/articles/2/comments')
			.send(testComment)
			.expect(201)
			.then(({ body: { comment } }) => {
				expect(comment).toMatchObject({
					comment_id: expect.any(Number),
					body: '60% of the time it works 100% of the time',
					article_id: 2,
					author: 'butter_bridge',
					votes: 0,
					created_at: expect.any(String),
				});
			});
	});
	test('404: Responds with error message when article id does not exist', () => {
		const testComment = {
			username: 'butter_bridge',
			body: '60% of the time it works 100% of the time',
		};
		return request(app)
			.post('/api/articles/8679/comments')
			.send(testComment)
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Not found');
			});
	});
	test('404: Responds with error message when username in body does not exist in the users table', () => {
		const testComment = {
			username: 'invalid_username',
			body: '60% of the time it works 100% of the time',
		};
		return request(app)
			.post('/api/articles/2/comments')
			.send(testComment)
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Not found');
			});
	});
	test('400: Responds with an error message when trying to post a comment with incomplete body', () => {
		const testComment = {
			username: 'butter_bridge',
		};
		return request(app)
			.post('/api/articles/2/comments')
			.send(testComment)
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad request');
			});
	});
	test('400: Responds with error message when passed an invalid url parameter', () => {
		const testComment = {
			username: 'butter_bridge',
			body: '60% of the time it works 100% of the time',
		};
		return request(app)
			.post('/api/articles/dog/comments')
			.send(testComment)
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad request');
			});
	});
});

describe('PATCH /api/articles/:article_id', () => {
	test('200: Responds with the updated article object when passed positive inc_votes number', () => {
		const updatedInfo = { inc_votes: 20 };
		return request(app)
			.patch('/api/articles/3')
			.send(updatedInfo)
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					article_id: 3,
					title: 'Eight pug gifs that remind me of mitch',
					topic: 'mitch',
					author: 'icellusedkars',
					body: 'some gifs',
					created_at: expect.any(String),
					votes: 20,
					article_img_url: expect.any(String),
				});
			});
	});
	test('200: Responds with the updated article object when passed negative inc_votes number', () => {
		const updatedInfo = { inc_votes: -50 };
		return request(app)
			.patch('/api/articles/3')
			.send(updatedInfo)
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article).toMatchObject({
					article_id: 3,
					title: 'Eight pug gifs that remind me of mitch',
					topic: 'mitch',
					author: 'icellusedkars',
					body: 'some gifs',
					created_at: expect.any(String),
					votes: -50,
					article_img_url: expect.any(String),
				});
			});
	});
	test('404: Responds with error message when passed valid url parameter that does not exist in database', () => {
		const updatedInfo = { inc_votes: 20 };
		return request(app)
			.patch('/api/articles/16817')
			.send(updatedInfo)
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Not found');
			});
	});
	test('400: Responds with error message when passed invalid url parameter for article id', () => {
		const updatedInfo = { inc_votes: 20 };
		return request(app)
			.patch('/api/articles/dog')
			.send(updatedInfo)
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad request');
			});
	});
	test('400: Responds with error message when passed invalid body parameter to update', () => {
		const updatedInfo = { inc_votes: 'cat' };
		return request(app)
			.patch('/api/articles/16817')
			.send(updatedInfo)
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad request');
			});
	});
});

describe('DELETE /api/comments/:comment_id', () => {
	test('204: Responds with only status code as no content to return', () => {
		return request(app).delete('/api/comments/8').expect(204);
	});
	test('404: Responds with an error message when passed a valid url parameter that does not exist in the database', () => {
		return request(app)
			.delete('/api/comments/68137')
			.expect(404)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Not found');
			});
	});
	test('400: Responds with an error message when passed an invalid url parameter', () => {
		return request(app)
			.delete('/api/comments/this-is-my-comment')
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad request');
			});
	});
});
