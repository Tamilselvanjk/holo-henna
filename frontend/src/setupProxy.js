const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/api/v1'
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          message: 'Backend server is not running. Please start the backend server.' 
        }));
      }
    })
  );

  // Add static files proxy
  app.use(
    '/*.png',
    createProxyMiddleware({
      target: 'http://localhost:3000/public',
      changeOrigin: true,
      onError: (err, req, res) => {
        console.error('Static file proxy error:', err);
        res.writeHead(404);
        res.end();
      }
    })
  );
};