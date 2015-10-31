#!/usr/bin/env node

// A filesystem cache entry is made up of two files:
// - .bin : the binary content
// - .json : the json encoded response headers
// The filename is created from a sha1 hash of the URL.

'use strict';

var
    request = require('request'),
    fs = require('fs'),
    jsSHA = require('jssha'),
    logger = require('./logger'),
    options = require('./options');

var createUrlHash = function (url) {
    var sha1 = new jsSHA('SHA-1', 'TEXT');
    sha1.update(url);
    return sha1.getHash('HEX');
};

var writeToCache = function (url, content, responseHeaders) {
    var hash = createUrlHash(url);
    logger.info('CACHE MISS: ', url);

    fs.writeFile('cache/'+hash+'.json', JSON.stringify(responseHeaders), { encoding: 'utf-8' }, function (err) {
        if (err) { logger.error(err); }
    });
    fs.writeFile('cache/'+hash+'.bin', content, { encoding: null }, function (err) {
        if (err) { logger.error(err); }
    });
};

var loadFromCache = function (url, callback) {
    var hash = createUrlHash(url);

    fs.readFile('cache/'+hash+'.json', function (err, data) {
        if (err) { callback(err); return; }
        var responseHeaders = JSON.parse(data);
        fs.readFile('cache/'+hash+'.bin', function (err, data) {
            if (err) { callback(err); return; }
            logger.info('CACHE HIT: ', url);
            return callback (err, responseHeaders, data);
        });
    });
};

var downloadFile = function (url, callback) {
    return request({url: url, encoding: null}, function(error, response, imageBuffer) {
        if (options.cacheEnabled) {
            writeToCache(url, imageBuffer, response.headers);
        }
        return callback(error, response.headers, imageBuffer);
    });
};

var downloadCache = function (url, callback) {
    if (options.cacheEnabled) {
        return loadFromCache(url, function (err, responseHeaders, content) {
            if (err) {
                return downloadFile(url, callback);
            }
            // CACHE HIT
            return callback(null, responseHeaders, content);
        });
    }
    return downloadFile(url, callback);
};

module.exports = downloadCache;
