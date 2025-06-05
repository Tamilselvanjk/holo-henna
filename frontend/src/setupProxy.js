
const { createProxyMiddleware } = require('http-proxy-middleware')
const CORS_CONFIG = require('.././../backend/config/cors').default

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:5000',
      changeOrigin: true,
      headers: {
        ...CORS_CONFIG.headers,
        host: process.env.REACT_APP_HOST
      },
      onProxyReq: function (proxyReq, req, res) {
        console.log('Proxying:', req.method, req.path)
      },
      onError: function (err, req, res) {
        console.error('Proxy Error:', err)
        res.writeHead(500, {
          'Content-Type': 'application/json',
        })
        res.end(JSON.stringify({
          message: 'Backend server connection error'
        }))
      },
    })
  )
}