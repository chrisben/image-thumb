#!/usr/bin/env node

'use strict';

var http = require('http'),
    express = require('express'),
    options = require('./services/options'),
    logger = require('./services/logger'),
    app = express();

/** PORT **/
var normalizePort = function (val) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
var port = normalizePort(options.serverPort);
app.set('port', port);

/** LOG ALL REQUESTS **/
app.use(function(req, res, next) {
    logger.info(req.method + ' ' + req.url);
    next(); // Passing the request to the next handler in the stack.
});

app.use('/', require('./routes/index'));

/** 404 **/
app.use(function (request, response) {
      response.writeHead(404, {'Content-Type': 'text/html'});
      response.end('<html>404 Not Found</html>');
});

/** START HTTP SERVER **/
var server = http.createServer(app);
server.on('listening', function () {
    logger.info('Listening at http://%s:%s', options.serverHost, port);
});
server.on('error', function (error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
});
server.listen(port, options.serverHost);

module.exports = app;
