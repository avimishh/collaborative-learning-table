const request = require('supertest');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const assert = require('assert'); // core module
let server;

const { Parent } = require('../../models/parent');

describe('/api/parents', () => {
    before(() => { server = require('../../index'); });
    afterEach(async () =>{
        await Parent.deleteMany({});
    });
    after(async () => {
        server.close();
    });

    describe('GET /', () => {
        it('should return all parents', async () => {
            await Parent.collection.insertMany([
                { firstName: 'parent1', lastName: 'parent1', id: '11111', password: '12345', phone: '12345' },
                { firstName: 'parent2', lastName: 'parent2', id: '22222', password: '12345', phone: '12345' }
            ]);

            const res = await request(server).get('/api/parents');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.lengthOf(2);
            expect(res.body.some(p => p.firstName === 'parent1' && p.id === '11111')).to.be.true;
            expect(res.body.some(p => p.firstName === 'parent2' && p.id === '22222')).to.be.true;

        });
    });

    describe('GET /:id', () => {
        it('should return a parent if valid id is passed', async () => {
            const parent = Parent({ firstName: 'parent1', lastName: 'parent1', id: '11111', password: '12345', phone: '12345' })
            await parent.save();

            const res = await request(server).get('/api/parents/' + parent.id);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property("firstName", 'parent1');
            expect(res.body).to.have.property("id", '11111'); 
        });

        it('should return 404 error if invalid id is passed', async () => {
            const parent = Parent({ firstName: 'parent1', lastName: 'parent1', id: '11111', password: '12345', phone: '12345' })
            await parent.save();

            const res = await request(server).get('/api/parents/' + '11112');
            expect(res.status).to.equal(404);
        });
    });

});