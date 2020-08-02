const request = require('supertest');
const { describe, it } = require('mocha');
const { expect } = require('chai');
const assert = require('assert'); // core module
let server;

const { Field } = require('../../models/field');
const mongoose = require('mongoose');
const { User } = require('../../models/user');

describe('/api/fields', () => {
    before(() => { server = require('../../index'); });
    afterEach(async () => {
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

    describe('POST /', () => {
        
        // Define the happy path, and then in each test, we change
        // one parameter that clearly aligns with the name of the
        // test.
        let token;
        let name;

        const exec = async () => {
            let newField = {
                name,
                description: 'field1_description'
            };
            return await request(server)
                .post('/api/fields/')
                .set('x-auth-token', token)
                .send(newField);
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'field1';
        });

        it('should return 401 error if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).to.equal(401);
        });

        it('should return 400 error if field.name is less than 5 charcters', async () => {
            name = '1234';
            
            const res = await exec();
            
            expect(res.status).to.equal(400);
            // console.log(res.text);
        });

        it('should return 400 error if field.name is more than 50 charcters', async () => {
            name = Array(52).join('a');

            const res = await exec();

            expect(res.status).to.equal(400);
            // console.log(res.text);
        });

        it('should save the field if it is valid', async () => {
            await exec();

            const field = await Field.find({
                name: 'field1',
                description: 'field1_description'
            });

            expect(field).to.lengthOf(1);
        });


        it('should return the field if it is valid', async () => {
            const res = await exec();

            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('_id');
            expect(res.body).to.have.property('name', 'field1');
        });
    });

});

