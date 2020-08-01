const { Parent } = require('../../../models/parent');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');

const { describe, it } = require('mocha');
const { expect } = require('chai');
const assert = require('assert'); // core module



describe('parent.generateAuthToken', () => {
    it('should return a valid JWT', () => {
        // payload depends on what jwt.sign encoding
        const payload = {
            _id: new mongoose.Types.ObjectId().toHexString()
            // userId: "12345",
            // password: "12345"
        };
        const parent = new Parent(payload);
        const token = parent.generateAuthToken();
        // if valid decoded holds the user properties,
        // else if fail will throw an exception
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        // console.log(decoded);
        expect(decoded).to.include(payload);
    });
});