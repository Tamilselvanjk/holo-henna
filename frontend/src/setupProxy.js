const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

module.exports = function(app) {
  const target = process.env.NODE_ENV === 'production'
    ? 'https://holo-henna.onrender.com'
    : 'http://localhost:5000'; // Changed from 3000 to 5000

  const proxyConfig = {
    target,
    changeOrigin: true,
    secure: false,
    ws: true,
    xfwd: true,
    onError: (err, req, res) => {
      // Handle connection errors
      if (err.code === 'ECONNREFUSED') {
        const productionUrl = 'https://holo-henna.onrender.com';
        // Redirect to production URL if local fails
        res.redirect(`${productionUrl}${req.path}`);
        return;
      }
      console.error('Proxy Error:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({ 
        success: false,
        message: 'Backend server is not available. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      }));
    },
    onProxyReq: (proxyReq, req, res) => {
      if (req.method === 'GET') return;
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Type', 'application/json');
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    }
  };

  // Static files handling
  app.use('/webimg', (req, res, next) => {
    try {
      res.sendFile(path.join(__dirname, '../public/webimg', req.path));
    } catch (error) {
      next();
    }
  });

  // Handle React static files locally first
  app.use('/*.png', (req, res, next) => {
    try {
      res.sendFile(path.join(__dirname, '../public', req.path));
    } catch (error) {
      next();
    }
  });

  // API endpoints proxy
  app.use(
    '/api',
    createProxyMiddleware({
      ...proxyConfig,
      pathRewrite: {
        '^/api': '/api/v1'
      },
      onProxyReq: (proxyReq, req, res) => {
        if (req.method === 'POST' && req.path.includes('/orders/create')) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Type', 'application/json');
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      }
    })
  );

  // Health check endpoint
  app.use(
    '/health',
    createProxyMiddleware({
      ...proxyConfig,
      pathRewrite: {
        '^/health': '/api/v1/health'
      }
    })
  );
};