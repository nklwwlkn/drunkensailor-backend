const app = require('../app');

const supertest = require('supertest');

const request = supertest(app);


describe("Tests the tests", () => {
    it('Should return the positive tests result', done  => {
        expect(1 + 1).toBe(2);
        
        done();
      });
});


