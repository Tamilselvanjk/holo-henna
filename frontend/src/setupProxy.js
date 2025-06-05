const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      onProxyReq: function(proxyReq, req, res) {
        // For debugging
        console.log('Proxying:', req.method, req.path);
      },
      onError: function(err, req, res) {
        console.error('Proxy Error:', err);
        res.writeHead(500, {
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
          message: 'Backend server is not running. Please start the backend server.'
        }));
      }
    })
  );
};
