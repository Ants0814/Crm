const express = require('express');
const session = require('express-session');
const https = require('https');
const path = require('path');
//라이브러리
const dataUtil = require('date-utils');
const cors = require('cors');
const fs = require('fs');

const request = require('./routers/request_router');


//서버 설정

const options = {
    key: fs.readFileSync(path.resolve(__dirname, './crt/skynet.re.kr.key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, './crt/skynet.re.kr.crt.pem')),
    ca: fs.readFileSync(path.resolve(__dirname, './crt/skynet.re.kr.ca.pem')),
};

const app = express(); // Default route for server status 
app.use(session({
    secret: '@antsnest', // 세션 암호화 키
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      maxAge: 24 * 60 * 60 * 1000 // 24시간
    }
  }));
//접근 CORS보안설정


var whitelist = [
    'http://localhost',
    'http://localhost:8000',
    'http://localhost:3000/',
    'https://crm.skynet.re.kr',
    'https://crm.skynet.re.kr:3000',
    undefined
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
//body-parser 기능을 해줌
app.use((req, res, next) => {
    if (req.is('application/json')) {
      let data = '';
  
      // 데이터 수신
      req.on('data', (chunk) => {
        data += chunk;
      });
  
      // 데이터 수신 완료 후 처리
      req.on('end', () => {
        try {
          // JSON 문자열을 정제하고 올바른 형태로 변환
         req.body = JSON.parse(data); // JSON 파싱 시도
        } catch (error) {
        const cleanedData = cleanJSONString(data.trim());
         console.log('Cleaned Data 파싱 시도:', cleanedData); // 디버깅을 위해 정제된 데이터를 로그로 출력
          console.error('Invalid JSON:', error.message);
          console.error('app 에서 파싱 실패 후 정재한 데이터:', cleanedData); // 원본 데이터를 로그로 출력하여 문제를 파악
          console.log(data);
          // JSON 파싱이 실패할 경우, 원본 데이터를 문자열로 설정
          req.body = data;
        }
  
        // 오류 여부와 관계없이 다음 미들웨어로 이동
        next();
      });
    } else {
      next();
    }
  });
  function cleanJSONString(str) {
    // JSON에서 사용할 수 없는 제어 문자를 제거하고, 개행 문자 등을 JSON 형식에 맞게 이스케이프 처리
    return str
      .replace(/^[\s\u0000-\u001F\u007F-\u009F]+|[\s\u0000-\u001F\u007F-\u009F]+$/g, '') // 문자열의 앞뒤에 있는 제어 문자와 공백을 제거
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // 문자열 중간의 제어 문자 제거
      .replace(/\\/g, '\\\\') // 백슬래시를 이중 백슬래시로 치환
      .replace(/\n/g, '\\n')  // 개행 문자를 이스케이프하여 JSON 형식으로 변환
      .replace(/\r/g, '\\r')  // 캐리지 리턴을 이스케이프하여 JSON 형식으로 변환
      .replace(/\t/g, '\\t')  // 탭 문자를 이스케이프하여 JSON 형식으로 변환
      .replace(/\"/g, '\\"'); // 따옴표를 이스케이프하여 JSON 형식으로 변환
  }
  
app.use((error, req, res, next) => {
    if (error instanceof SyntaxError) {
        return res.status(400).send({ message: 'Invalid JSON format' });
    }
    next();
});
app.use(express.urlencoded({ extended: false }));

//스테틱 폴더 경로설정
app.use('/request', request);
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


app.get('/health', (req, res) => {
    console.log('요청확인');
    res.status(200).send('OK');
  });



// const httpServer=http.createServer(app).listen(HTTP_PORT,()=>{
//     console.log('HTTP =>AWS HTTPS 자동전환 서버 시작 : '+HTTP_PORT);
// }); // Create an HTTPS server. 
const httpsServer = https.createServer(options,app);
module.exports = httpsServer;