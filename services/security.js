#!/usr/bin/env node

'use strict';

var
    jsSHA = require('jssha'),
    options = require('./options');


var generateHMAC = function (securityKey, urlPath) {
    if (securityKey) {
        var shaObj = new jsSHA('SHA-1', 'TEXT');
        shaObj.setHMACKey(securityKey, 'TEXT');
        shaObj.update(urlPath);
        return shaObj.getHMAC('HEX');
    }
    return null;
};

var checkHMAC = function (urlPath, hmac) {
    return (hmac === generateHMAC(options.securityKey, urlPath));
};

module.exports.generateHMAC = generateHMAC;
module.exports.checkHMAC = checkHMAC;
