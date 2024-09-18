const express = require('express');
const path = require('path');
//라이브러리
const dataUtil = require('date-utils');//new Date쓸때 써야함
const cors = require('cors');
const fs = require('fs');

const request = require('./routers/request_router');

//서버 설정
const HTTP_PORT = 80;

const app = express(); // Default route for server status 
//접근 CORS보안설정


var whitelist = [
    'http://localhost',
    ]
    var corsOptions = {
        origin: function (origin, callback, req) {
            var userAgent = req.headers['user-agent'] || "Unknown User-Agent";
            var referrer = req.headers['referrer'] || req.headers['referer'] || "Unknown Referrer"; 
            if (whitelist.indexOf(origin) !== -1) {
                console.log('정상 요청 : ' + origin);
                console.log('출처 요청. User-Agent: ' + userAgent + ', Referrer: ' + referrer);
                callback(null, true);
            } else if (origin === undefined) {
                console.log('알수없는 출처 요청. User-Agent: ' + userAgent + ', Referrer: ' + referrer);
                callback(null, false);
            } else {
                console.log('origin 주소 : ' + origin);
                console.log('허용하지 않은 접근' + origin);
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    }
    app.use((req, res, next) => {
        cors({
            ...corsOptions,
            origin: (origin, callback) => corsOptions.origin(origin, callback, req)
        })(req, res, next);
    });

//API 등록 시작
app.use(express.static('static'));
app.use(express.static('src'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//스테틱 폴더 경로설정
app.use('/', request);
app.use(express.static(path.resolve(__dirname, "../build")));
console.log(path.resolve(__dirname + '/../static'));
app.use('/app', express.static(path.resolve(__dirname + '/../static')));
console.log('HTTPS-서버시작');

//HTTP 접근 설정
app.get("/", (req, res) => {
    fs.readFile(path.resolve(__dirname, "../build/index.html"), (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).send("<h1>500 Error</h1>");
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
});

//라우팅 처리 함수
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, '../build/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
  })

app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });

app.get("/", (req, res) => {
    const index = path.resolve(__dirname, "../build/index.html");
    res.sendFile(index);
});

module.exports =app;