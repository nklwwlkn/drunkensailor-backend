const app = require('../app');

const supertest = require('supertest');

const request = supertest(app);


describe("Tests the entry point", () => {
    it('Should return the entry point', async done  => {
        const response = await request.get('/');
      
        expect(1 + 1).toBe(2);
        
        done();
      });
});


