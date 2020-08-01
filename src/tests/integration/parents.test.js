const request = require('supertest');
let server;

describe('/api/parents', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(() => { server.close(); });

    describe('GET /', () => {
        it('should return all parents', async () => {
            const res = await request(server).get('/api/parents');
            expect(res.status).toBe(200);
        });
    });

});