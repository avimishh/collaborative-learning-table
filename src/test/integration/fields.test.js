const request = require('supertest');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const assert = require('assert'); // core module
let server;

const { Field } = require('../../models/field');
const mongoose = require('mongoose');

describe('/api/fields', () => {
    before(() => { server = require('../../index'); });
    afterEach(async () =>{
        await Field.deleteMany({});
    });
    after(async () => {
        server.close();
    });

    describe('GET /', () => {
        it('should return all fields', async () => {
            await Field.collection.insertMany([
                { name: 'field1', description: 'field1_description' },
                { name: 'field2', description: 'field2_description' }
            ]);

            const res = await request(server).get('/api/fields');
            expect(res.status).to.equal(200);
            expect(res.body).to.have.lengthOf(2);
            expect(res.body.some(f => f.name === 'field1')).to.be.true;
            expect(res.body.some(f => f.name === 'field2')).to.be.true;
        });
    });

    describe('GET /:id', () => {
        it('should return a field if valid id is passed', async () => {
            const field = Field({ name: 'field1', description: 'field1_description' })
            await field.save();

            const res = await request(server).get('/api/fields/' + field._id);
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('name', 'field1');
        });

        it('should return 404 error if invalid objectId is passed', async () => {
            const res = await request(server).get('/api/fields/1');
            expect(res.status).to.equal(404);
            expect(res.text).to.match(/Invalid ID/);
        });

        it('should return 404 error if field with given id is not exist', async () => {
            let id = mongoose.Types.ObjectId();

            const res = await request(server).get('/api/fields/' + id);
            expect(res.status).to.equal(404);
            expect(res.text).to.match(/was not found/);
        });
    });

});