const app = require('../app');

const supertest = require('supertest');

const request = supertest(app);


describe("Tests the entry point", () => {
    it('Should return the entry point', async done  => {
        const response = await request.get('/');
      
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Entry point');
        done();
      });
});


