#!/usr/bin/env node

'use strict';

var security = require('../services/security');

var args = process.argv.slice(2);

if (args.length != 2) {
    console.log('** Usage: node hmac.js SECRET_KEY URL_PATH');
    process.exit(1);
}

var
    secretKey = args[0],
    urlPath = args[1];

var
    hmac = security.generateHMAC(secretKey, urlPath);

if (!hmac) {
    console.error('Failed to generate HMAC, check your input parameters');
    process.exit(2);
}

console.log(hmac);
