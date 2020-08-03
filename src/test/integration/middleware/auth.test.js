const request = require('supertest');
const { describe, it } = require('mocha');
const { expect } = require('chai');

let server;
const mongoose = require('mongoose');
const { User } = require('../../../models/user');
const { Field } = require('../../../models/field');


describe('auth middleware', () => {
    before(() => { server = require('../../../index'); });
    after(async () => { server.close(); });

    let token;
    const exec = () => {
        let newField = {
            name: 'field1',
            description: 'field1_description'
        };
        return request(server)
            .post('/api/fields/')
            .set('x-auth-token', token)
            .send(newField);
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });
    afterEach(async () => {
        await Field.deleteMany({});
    });

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).to.equal(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).to.equal(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).to.equal(200);
    });
});