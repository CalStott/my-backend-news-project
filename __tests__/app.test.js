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
				.get('/api/articles/1')
				.expect(200)
				.then(({ body: { article } }) => {
					expect(article).toMatchObject({
						article_id: 1,
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
});
