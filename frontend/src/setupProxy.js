const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const express = require('express');

module.exports = function(app) {
  // Static file handling first
  app.use('/static', express.static(path.join(__dirname, '../public')));
  app.use('/webimg', express.static(path.join(__dirname, '../public/webimg')));

  const proxyConfig = {
    target: 'http://localhost:5000',
    changeOrigin: true,
    ws: false, // Disable WebSocket
    secure: false,
    logLevel: 'debug',
    onError: (err, req, res) => {
      if (err.code === 'ECONNREFUSED') {
        // Serve static files locally if backend is not available
        if (req.path.match(/\.(jpg|png|svg|ico)$/)) {
          try {
            res.sendFile(path.join(__dirname, '../public', req.path));
            return;
          } catch (error) {
            // Fall through to error response
          }
        }
      }
      res.writeHead(500, {
        'Content-Type': 'application/json',
      });
      res.end(JSON.stringify({
        success: false,
        message: 'Backend server is not available.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      }));
    }
  };

  // API endpoints proxy
  app.use(
    '/api',
    createProxyMiddleware({
      ...proxyConfig,
      pathRewrite: { '^/api': '/api/v1' }
    })
  );

  // Health check endpoint
  app.use(
    '/health',
    createProxyMiddleware({
      ...proxyConfig,
      pathRewrite: { '^/health': '/api/v1/health' }
    })
  );
};