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
						author: 'icellusedkars',
						title: 'Sony Vaio; or, The Laptop',
						body: expect.any(String),
						topic: 'mitch',
						created_at: expect.any(String),
						votes: 0,
						article_img_url: expect.any(String),
					});
				});
		});
		test('200: Responds with an object detailing the information for the specified article with added comment_count key', () => {
			return request(app)
				.get('/api/articles/6')
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article).toMatchObject({
						article_id: 6,
						author: 'icellusedkars',
						title: 'A',
						body: 'Delicious tin of cat food',
						topic: 'mitch',
						created_at: expect.any(String),
						votes: 0,
						article_img_url: expect.any(String),
						comment_count: 1,
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
		test('200: Responds with an array of article objects including comment count key and no body key, limited to 10 results due to pagination default value', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body: { articles } }) => {
					expect(articles).toHaveLength(10);
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
						expect(articles).toHaveLength(10);
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
						expect(articles).toHaveLength(10);
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
						expect(articles).toHaveLength(10);
						expect(articles).toBeSortedBy('author');
					});
			});
			test('200: Should correctly filter the data by the input topic query', () => {
				return request(app)
					.get('/api/articles?topic=cats')
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toHaveLength(1);
						articles.forEach((article) => {
							expect(article).toMatchObject({
								article_id: expect.any(Number),
								author: expect.any(String),
								title: expect.any(String),
								topic: 'cats',
								created_at: expect.any(String),
								votes: expect.any(Number),
								article_img_url: expect.any(String),
								comment_count: expect.any(Number),
							});
						});
					});
			});
			test('200: Should correctly filter the data by the input topic query if there is no information to return', () => {
				return request(app)
					.get('/api/articles?topic=paper')
					.expect(200)
					.then(({ body: { articles } }) => {
						expect(articles).toEqual([]);
					});
			});
			test('404: Responds with error message when passed invalid topic query', () => {
				return request(app)
					.get('/api/articles?topic=bricks')
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Not found');
					});
			});
		});

		describe('GET /api/articles pagination', () => {
			test('200: Should correctly limit returned results to input limit query', () => {
				return request(app)
					.get('/api/articles?limit=8')
					.expect(200)
					.then(({ body }) => {
						const { articles, total_count } = body;
						expect(total_count).toBe(8);
						expect(articles).toHaveLength(8);
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
			test('200: Should correctly offset results by the input page query', () => {
				return request(app)
					.get('/api/articles?p=1')
					.expect(200)
					.then(({ body }) => {
						const { articles, total_count } = body;
						expect(total_count).toBe(3);
						expect(articles).toHaveLength(3);
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
			test('200: Should correctly limit and offset results by the input limit and page queries', () => {
				return request(app)
					.get('/api/articles?limit=5&p=2')
					.expect(200)
					.then(({ body }) => {
						const { articles, total_count } = body;
						expect(total_count).toBe(3);
						expect(articles).toHaveLength(3);
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
			test('404: Responds with an error message when passed valid page parameter but there is no information to show', () => {
				return request(app)
					.get('/api/articles?p=50')
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Not found');
					});
			});
			test('400: Responds with an error message when passed an invalid limit parameter', () => {
				return request(app)
					.get('/api/articles?limit=there_is_no_limit')
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					});
			});
			test('400: Responds with an error message when passed an invalid page parameter', () => {
				return request(app)
					.get('/api/articles?p=every_page')
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
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
		describe('GET /api/articles/:article_id/comments pagination', () => {
			test('200: Should correctly limit returned results to input limit query', () => {
				return request(app)
					.get('/api/articles/1/comments?limit=8')
					.expect(200)
					.then(({ body: { comments } }) => {
						expect(comments).toHaveLength(8);
						expect(comments).toBeSortedBy('created_at', { descending: true });
						comments.forEach((comment) => {
							expect(comment).toMatchObject({
								comment_id: expect.any(Number),
								body: expect.any(String),
								article_id: 1,
								author: expect.any(String),
								votes: expect.any(Number),
								created_at: expect.any(String),
							});
						});
					});
			});
			test('200: Should correctly offset results by the input page query', () => {
				return request(app)
					.get('/api/articles/1/comments?p=1')
					.expect(200)
					.then(({ body: { comments } }) => {
						expect(comments).toHaveLength(1);
						expect(comments).toBeSortedBy('created_at', { descending: true });
						comments.forEach((comment) => {
							expect(comment).toMatchObject({
								comment_id: expect.any(Number),
								body: expect.any(String),
								article_id: 1,
								author: expect.any(String),
								votes: expect.any(Number),
								created_at: expect.any(String),
							});
						});
					});
			});
			test('200: Should correctly limit and offest results by the input limit and page queries', () => {
				return request(app)
					.get('/api/articles/1/comments?limit=3&p=2')
					.expect(200)
					.then(({ body: { comments } }) => {
						expect(comments).toHaveLength(3);
						expect(comments).toBeSortedBy('created_at', { descending: true });
						comments.forEach((comment) => {
							expect(comment).toMatchObject({
								comment_id: expect.any(Number),
								body: expect.any(String),
								article_id: 1,
								author: expect.any(String),
								votes: expect.any(Number),
								created_at: expect.any(String),
							});
						});
					});
			});
			test('404: Responds with an error message when passed a valid page parameter but there is no information to show', () => {
				return request(app)
					.get('/api/articles/1/comments?p=43')
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Not found');
					});
			});
			test('400: Responds with an error message when passed an invalid limit parameter', () => {
				return request(app)
					.get('/api/articles/1/comments?limit=unlimited')
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					});
			});
			test('400: Responds with an error message when passed an invalid page parameter', () => {
				return request(app)
					.get('/api/articles/1/comments?p=I_dont_know')
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					});
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
		describe('GET /api/users/:username', () => {
			test('200: Responds with an object of the input user', () => {
				return request(app)
					.get('/api/users/rogersop')
					.expect(200)
					.then(({ body: { user } }) => {
						expect(user).toMatchObject({
							username: 'rogersop',
							name: 'paul',
							avatar_url: expect.any(String),
						});
					});
			});
			test('404: Responds with error message when passed a valid url parameter that does not exist in the database', () => {
				return request(app)
					.get('/api/users/the-wizard')
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Not found');
					});
			});
		});
	});
});

describe('POST /api', () => {
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

	describe('POST /api/articles', () => {
		test('201: Responds with the posted article', () => {
			const testArticle = {
				author: 'lurker',
				title: 'How to test for Dummies',
				body: "It's a bad sign if you're only just learning this now",
				topic: 'paper',
				article_img_url: 'https://tinyurl.com/testing-for-dummies',
			};
			return request(app)
				.post('/api/articles')
				.send(testArticle)
				.expect(201)
				.then(({ body: { article } }) => {
					expect(article).toMatchObject({
						article_id: 14,
						title: 'How to test for Dummies',
						topic: 'paper',
						author: 'lurker',
						body: "It's a bad sign if you're only just learning this now",
						created_at: expect.any(String),
						votes: 0,
						article_img_url: 'https://tinyurl.com/testing-for-dummies',
						comment_count: 0,
					});
				});
		});
		test('404: Responds with error message when author does not exist in the users table', () => {
			const testArticle = {
				author: 'ConMan101',
				title: 'How to test for Dummies',
				body: "It's a bad sign if you're only just learning this now",
				topic: 'paper',
				article_img_url: 'https://tinyurl.com/testing-for-dummies',
			};
			return request(app)
				.post('/api/articles')
				.send(testArticle)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Not found');
				});
		});
		test('404: Responds with error message when topic does not exist in the topics table', () => {
			const testArticle = {
				author: 'lurker',
				title: 'How to test for Dummies',
				body: "It's a bad sign if you're only just learning this now",
				topic: 'Progamming Lessons',
				article_img_url: 'https://tinyurl.com/testing-for-dummies',
			};
			return request(app)
				.post('/api/articles')
				.send(testArticle)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Not found');
				});
		});
		test('400: Responds with error message when trying to post an article with an incomplete body', () => {
			const testArticle = {
				author: 'lurker',
				body: "It's a bad sign if you're only just learning this now",
				topic: 'paper',
				article_img_url: 'https://tinyurl.com/testing-for-dummies',
			};
			return request(app)
				.post('/api/articles')
				.send(testArticle)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
	});
});

describe('PATCH /api', () => {
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
				.patch('/api/articles/3')
				.send(updatedInfo)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
	});

	describe('PATCH /api/comments/:comment_id', () => {
		test('200: Responds with updated comment when passed a positive votes number', () => {
			const updatedInfo = { inc_votes: 20 };
			return request(app)
				.patch('/api/comments/2')
				.send(updatedInfo)
				.expect(200)
				.then(({ body: { comment } }) => {
					expect(comment).toMatchObject({
						comment_id: 2,
						body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
						votes: 34,
						author: 'butter_bridge',
						article_id: 1,
						created_at: expect.any(String),
					});
				});
		});
		test('200: Responds with updated comment when passed a negative votes number', () => {
			const updatedInfo = { inc_votes: -44 };
			return request(app)
				.patch('/api/comments/2')
				.send(updatedInfo)
				.expect(200)
				.then(({ body: { comment } }) => {
					expect(comment).toMatchObject({
						comment_id: 2,
						body: 'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
						votes: -30,
						author: 'butter_bridge',
						article_id: 1,
						created_at: expect.any(String),
					});
				});
		});
		test('404: Responds with error message when passed a valid url parameter that does not exist in the database', () => {
			const updatedInfo = { inc_votes: 20 };
			return request(app)
				.patch('/api/comments/615')
				.send(updatedInfo)
				.expect(404)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Not found');
				});
		});
		test('400: Responds with error message when passed invalid url parameter', () => {
			const updatedInfo = { inc_votes: 20 };
			return request(app)
				.patch('/api/comments/this-is-my-comment')
				.send(updatedInfo)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
		test('400: Responds with error message when passed invalid body parameter', () => {
			const updatedInfo = { inc_votes: "I don't like this" };
			return request(app)
				.patch('/api/comments/1')
				.send(updatedInfo)
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
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
