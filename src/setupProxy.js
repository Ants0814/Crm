
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    createProxyMiddleware(['/request'], {
      target: "https://crm.skynet.re.kr",
      changeOrigin: true,
      secure: false,
      logLevel: "debug", // 디버그 로그 활성화
      onProxyReq: (proxyReq, req, res) => {
        // 추가적인 헤더 설정 필요 시
        proxyReq.setHeader('origin', 'https://crm.skynet.re.kr');
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error');
      },
    })
  );
};