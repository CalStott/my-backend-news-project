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
	test('400: Responds with an error message when passed an incorrect url', () => {
		return request(app)
			.get('/not-a-url')
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe('Bad request');
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
		test('400: Responds with an error message when passed an incorrect url', () => {
			return request(app)
				.get('/api/topic')
				.expect(400)
				.then(({ body: { msg } }) => {
					expect(msg).toBe('Bad request');
				});
		});
		test('404: Responds with an error message when passed a correct url but there is no information to return', () => {
			return db.query(`DROP TABLE comments;`).then(() => {
				return db.query(`DROP TABLE articles;`).then(() => {
					return db.query(`DELETE FROM topics;`).then(() => {
						return request(app)
							.get('/api/topics')
							.expect(404)
							.then(({ body: { msg } }) => {
								expect(msg).toBe('Not found');
							});
					});
				});
			});
		});
	});
});
