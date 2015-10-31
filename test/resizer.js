#!/usr/bin/env node
/* global describe, it */

'use strict';

var
    env = require('./test-env'),
    assert = require('assert'),
    resizer = require('../services/resizer');

describe('resizer', function () {
    it('should download and process an image', function (done) {
        resizer('http://www.nasa.gov/sites/default/files/images/nasaLogo-570x450.png', 100, 100, 'center', 'middle', function (buffer, contentType) {
            assert.equal('image/png', contentType);
            done();
        });
    });
});
