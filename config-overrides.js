const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

module.exports = function override(config, env) {
   // 로그 추가 - fallback 설정 확인
   const fallback = config.resolve.fallback || {};
   
  Object.assign(fallback, {
    path: require.resolve('path-browserify'),
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    https: require.resolve('https-browserify'),
    http: require.resolve('stream-http'),
    buffer: require.resolve('buffer'),
    util: require.resolve('util'),
  });
  console.log('현재 fallback 설정 전:', fallback);
  config.resolve.fallback = fallback;

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
      
    }),
  ]);

  if (env === 'development') {
    config.devServer = {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'appService/crt/skynet.re.kr.key.pem')),
        cert: fs.readFileSync(path.resolve(__dirname, 'appService/crt/skynet.re.kr.crt.pem')),
        ca: fs.readFileSync(path.resolve(__dirname, 'appService/crt/skynet.re.kr.ca.pem')), // 추가
      },
      host: 'skynet.re.kr',
      port: 3000,
      hot: true,
      historyApiFallback: true,
      proxy: {
        '/request': {
          target: 'https://crm.skynet.re.kr',
          secure: true, // SSL 인증서 확인을 건너뜁니다.
          changeOrigin: true,
          logLevel: 'debug',
        },
      },
    };
  }

  return config;
};