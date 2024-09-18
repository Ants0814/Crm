const https= require('./execute_prd');
const dev = require('./execute_dev');
const local = require('./execute_local');
require('dotenv').config();

const environments = {
    'prd': {
        port: 443,
        server: https
    },
    'dev': {
        port: 80, 
        server: dev
    },
    'local': {
        port: 3000,
        server: local
    }
};
console.log('ENV:'+process.env.OPERATION);
// const env = process.env.OPERATION || 'local'; //기존 방식
const env = process.argv[2] || 'local'; // 첫번째 커맨드라인 인자 또는 'local'
console.log(env);
const currentConfig = environments[env]; // 현재 환경에 맞는 설정 로드

currentConfig.server.listen(currentConfig.port, () => {
    console.log(`Server is running on port ${currentConfig.port} in ${env} mode.`);
});

//실행하는 방법 : 
//local/dev/prd를 알맞게 넣어 사용

//set operation=local && node execute     
//set operation=dev && node execute    
//set operation=prd && node execute   