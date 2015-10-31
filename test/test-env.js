#!/usr/bin/env node
/* global describe, it */

'use strict';

// Options
process.env.LOG_LEVEL = 0;
process.env.CACHE_ENABLED = 0;
process.env.SECURITY_KEY = 'test';

module.exports = process.env;
