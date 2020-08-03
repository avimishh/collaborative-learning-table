const request = require('supertest');
const { describe, it } = require('mocha');
const { expect } = require('chai');

const { User } = require('../../../models/user');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');


describe('auth middleware', () => {
    it('should populate req.user with the payload of a valid JWT', () => {
        const user = { _id: mongoose.Types.ObjectId().toHexString() };
        const token = new User(user).generateAuthToken();
        const req = {
            header: () => { return token; }
        };

        const res = {};
        const next = () => { };

        auth(req, res, next);

        expect(req.user).to.include(user);
    });
});