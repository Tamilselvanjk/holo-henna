const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
      pathRewrite: {
        '^/api': '/api/v1'
      },
      onProxyReq: (proxyReq, req, res) => {
        console.log('Proxying:', req.method, req.path)
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err)
        res.writeHead(500, {
          'Content-Type': 'application/json',
        })
        res.end(JSON.stringify({ message: 'Proxy error' }))
      },
    })
  )
}