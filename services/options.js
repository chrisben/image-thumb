#!/usr/bin/env node

'use strict';

var options = {
    // Server host IP/name
    serverHost:     (process.env.SERVER_HOST ||
        '127.0.0.1'),

    // Server port number
    serverPort:     (process.env.SERVER_PORT ||
        '8081'),

    // 0: None, 1: Error, 2: Error+Info
    logLevel:       (process.env.LOG_LEVEL ? parseInt(process.env.LOG_LEVEL, 10) :
        2),

    // Jpeg compression quality (0-100)
    jpegQuality:    (process.env.JPEG_QUALITY ? parseInt(process.env.JPEG_QUALITY, 10) :
        75),

    // Enables filesystem cache for downloaded files (true/false)
    cacheEnabled:   (process.env.CACHE_ENABLED ? (process.env.CACHE_ENABLED == 'true' || process.env.CACHE_ENABLED == '1') :
        true),

    // Security HMAC secret key (string / null=no security)
    securityKey:    (process.env.SECURITY_KEY ||
	null),
};

module.exports = options;
