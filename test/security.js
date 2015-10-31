#!/usr/bin/env node
/* global describe, it */

'use strict';

var
    env = require('./test-env'),
    assert = require('assert'),
    security = require('../services/security');

describe('security', function () {
    it('should generate HMAC using the given security key', function () {
        assert.equal('fd67d75d57b3cc74e8118109fc2e16bcb7a50f61', security.generateHMAC(process.env.SECURITY_KEY, '100x200/https://test.com/file.jpg'));
    });
});
