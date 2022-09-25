const userService = require('../server')
const request = require("supertest")
const baseURL = "http://localhost:9999"

describe('User Endpoints', () => {
    it('GET /user should show all users', async () => {
      const res = await requestWithSupertest.get('/users');
        expect(res.status).toEqual(200);
        expect(res.type).toEqual(expect.stringContaining('json'));
        expect(res.body).toHaveProperty('users')
    });
  
  });


describe('user service', () => {
    it('do something', async () => {
        const res = await userService.post('/api/login').send({
            username: 'bobert',
            password: 'bobert'
        });
        expect(res.status).toBe('ok');
    })
})