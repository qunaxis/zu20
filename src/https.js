// import express from 'express'  // сам фреймворк
import http from 'http'  // для организации http
import https from 'https'  // для организации https
import fs from 'fs'  // для чтения ключевых файловам фреймворк
import path from 'path'
import app from './app'

const HTTP_PORT = 80
const HTTPS_PORT = 443

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, './cfg/server.key')), // путь к ключу
    cert: fs.readFileSync(path.join(__dirname, './cfg/server.crt')) // путь к сертификату
}
// const httpServer = http.createServer(app)
const httpsServer = https.createServer(httpsOptions, app)

// Redirect from HTTP to HTTPS
const httpServer = http.createServer((req, res) => {  
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
})

httpServer.listen(HTTP_PORT, () => console.log(`HTTP listening on port ${HTTP_PORT}`))
httpsServer.listen(HTTPS_PORT, () => console.log(`HTTPS listening on port ${HTTPS_PORT}`))

