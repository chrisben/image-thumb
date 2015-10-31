#!/usr/bin/env node

'use strict';

var options = require('./options');

var loggerInfo = function () {
    if (options.logLevel >= 2) {
        console.log.apply(null, arguments);
    }
};
var loggerError = function () {
    if (options.logLevel >= 1) {
        console.error.apply(null, arguments);
    }
};

module.exports.info = loggerInfo;
module.exports.error = loggerError;
