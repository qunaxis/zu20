'use strict';

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// для чтения ключевых файловам фреймворк
// для организации http
const HTTP_PORT = 80; // для организации https
// import express from 'express'  // сам фреймворк

const HTTPS_PORT = 443;

const httpsOptions = {
    key: _fs2.default.readFileSync(_path2.default.join(__dirname, './cfg/server.key')), // путь к ключу
    cert: _fs2.default.readFileSync(_path2.default.join(__dirname, './cfg/server.crt')) // путь к сертификату

    // const httpServer = http.createServer(app)
};const httpsServer = _https2.default.createServer(httpsOptions, _app2.default);

// Redirect from HTTP to HTTPS
const httpServer = _http2.default.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
});

httpServer.listen(HTTP_PORT, () => console.log(`HTTP listening on port ${HTTP_PORT}`));
httpsServer.listen(HTTPS_PORT, () => console.log(`HTTPS listening on port ${HTTPS_PORT}`));
//# sourceMappingURL=https.js.map