#!/usr/bin/env node

'use strict';

var
    lwip = require('lwip'),
    options = require('./options'),
    logger = require('./logger'),
    cache = require('./cache');

var handleError = function(err) {
    logger.error(err);
    throw err;
};

// Downloads, crop/resize an image to always fit the given dimensions
var createThumbnailFromUrl = function (url, targetWidth, targetHeight, horizontalAlign, verticalAlign, callback) {
    if (targetHeight === 0 && targetWidth === 0) {
        throw 'At least one of width or height needs to be set';
    }

    logger.info('[' + url + '] -> ' + targetWidth + 'x' + targetHeight);

    cache(url, function (error, responseHeaders, imageBuffer) {
        var contentType = responseHeaders['content-type'];
        logger.info('Content-Type:', contentType);
        var imageFormat = contentType.match(/(png|jpg|jpeg|gif)/)[0];

        lwip.open(imageBuffer, imageFormat, function (err, image) {
            if (err || !image) {
                return handleError(err);
            }

            var origWidth = image.width(),
                origHeight = image.height(),
                origRatio = (origHeight !== 0 ? (origWidth / origHeight) : 1),
                cropWidth = origWidth,
                cropHeight = origHeight,
                targetRatio = ((targetHeight !== 0 && targetWidth !== 0) ? (targetWidth / targetHeight) : origRatio);

            if (targetWidth === 0) {
                targetWidth = Math.round(targetHeight * targetRatio);
            } if (targetHeight === 0) {
                targetHeight = Math.round(targetWidth / targetRatio);
            }

            logger.info('Original: ' + origWidth + 'x' + origHeight + ' -> Target: ' + targetWidth + 'x' + targetHeight);

            if (targetRatio > origRatio) {
                // original image too high
                cropHeight = Math.round(origWidth / targetRatio);
            } else if (targetRatio < origRatio) {
                // original image too wide
                cropWidth = Math.round(origHeight * targetRatio);
            }

            // These are coordinates starting from 0
            var left, right, top, bottom;

            if (horizontalAlign == 'left') {
                left = 0;
                right = cropWidth - 1;
            } else if (horizontalAlign == 'right') {
                left = origWidth - cropWidth;
                right = origWidth - 1;
            } else {
                // default: center
                left = Math.round((origWidth - cropWidth)/2);
                right = left + cropWidth - 1;
            }

            if (verticalAlign == 'top') {
                top = 0;
                bottom = cropHeight - 1;
            } else if (verticalAlign == 'bottom') {
                top = origHeight - cropHeight;
                bottom = origHeight - 1;
            } else {
                // default: middle
                top = Math.round((origHeight - cropHeight)/2);
                bottom = top + cropHeight - 1;
            }

            logger.info('Crop dimensions: ' + cropWidth + 'x' + cropHeight + ' left: ' + left + ' right: ' + right + ' top: '+ top + ' bottom: ' + bottom);

            var lwipOptions = {
                quality: options.jpegQuality
            };

            image.batch()
                .crop(left, top, right, bottom)
                .resize(targetWidth, targetHeight, 'lanczos')
                .toBuffer(imageFormat, lwipOptions, function (err, buffer) {
                   if (err || !image) {
                       return handleError(err);
                   }
                   if (callback) {
                       callback(buffer, contentType);
                   }
                });
        });
   });
};

module.exports = createThumbnailFromUrl;
