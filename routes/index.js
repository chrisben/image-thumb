#!/usr/bin/env node

'use strict';

var resizer = require('../services/resizer'),
    security = require('../services/security'),
    options = require('../services/options'),
    router = require('express').Router();

var processRequest = function (req, res) {
    // compulsory parameters
    var url = req.params.url,
        targetWidth = parseInt(req.params.width, 10),
        targetHeight = parseInt(req.params.height, 10);
    // optional parameters
    var hAlign = (req.params.hAlign ? req.params.hAlign : 'center'),
        vAlign = (req.params.vAlign ? req.params.vAlign : 'middle'),
        hmac = req.params.hmac;

    // if the security is activated, check that the hmac matches
    if (options.securityKey) {
        var urlRest = req.originalUrl.replace('/'+hmac, '');
        if (!security.checkHMAC(urlRest, hmac)) {
            res.writeHead(403, {'Content-Type': 'text/html'});
            res.end('<html>403 Forbidden</html>');
            return;
        }
    }

    resizer(url, targetWidth, targetHeight, hAlign, vAlign, function (buffer, contentType) {
        res.set('Content-Type', contentType);
        res.end(buffer);
    });
};

// /300x100/left/top/https://fr.animalblog.co/wp-content/uploads/2013/08/chat_peur1.jpg
router.get('/:width(\\d+)x:height(\\d+)/:hAlign(left|center|right)/:vAlign(top|middle|bottom)/:url(*)', processRequest);

// /300x100/https://fr.animalblog.co/wp-content/uploads/2013/08/chat_peur1.jpg
// /0x100/https://fr.animalblog.co/wp-content/uploads/2013/08/chat_peur1.jpg
// /500x0/https://fr.animalblog.co/wp-content/uploads/2013/08/chat_peur1.jpg
router.get('/:width(\\d+)x:height(\\d+)/:url(*)', processRequest);

// secured routes with hmac prefix
router.get('/:hmac([0-9a-f]+)/:width(\\d+)x:height(\\d+)/:hAlign(left|center|right)/:vAlign(top|middle|bottom)/:url(*)', processRequest);
router.get('/:hmac([0-9a-f]+)/:width(\\d+)x:height(\\d+)/:url(*)', processRequest);

module.exports = router;
