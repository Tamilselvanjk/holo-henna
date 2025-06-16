const { createProxyMiddleware } = require('http-proxy-middleware')
const path = require('path')
const express = require('express')

module.exports = function (app) {
  const proxyConfig = {
    target: 'http://localhost:5000',
    changeOrigin: true,
    ws: false,
    secure: false,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req) => {
      // Remove cache-control header
      proxyReq.removeHeader('cache-control')
      console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`)
    },
    headers: {
      'Access-Control-Allow-Origin': 'https://holo-henna-frontend.onrender.com',
      'Access-Control-Allow-Credentials': 'true',
    },
  }

  // Handle React routes that need direct access
  app.get(
    ['/login', '/profile', '/order-success/*', '/orders/*'],
    (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'))
    }
  )

  // Static files handling first
  app.use('/static', express.static(path.join(__dirname, '../public')))
  app.use(
    '/favicon.ico',
    express.static(path.join(__dirname, '../public/favicon.ico'))
  )

  // API endpoints proxy with order handling
  app.use(
    '/api/v1',
    createProxyMiddleware({
      ...proxyConfig,
      pathRewrite: undefined, // Don't rewrite paths for /api/v1
      onError: (err, req, res) => {
        if (err.code === 'ECONNREFUSED') {
          const prodUrl = 'https://holo-henna.onrender.com'
          return res.redirect(`${prodUrl}${req.url}`)
        }
        res.writeHead(500, {
          'Content-Type': 'application/json',
        })
        res.end(
          JSON.stringify({
            success: false,
            message: 'Backend server is not available.',
            error:
              process.env.NODE_ENV === 'development' ? err.message : undefined,
          })
        )
      },
    })
  )

  // Products endpoint proxy
  app.use(
    '/products',
    createProxyMiddleware({
      ...proxyConfig,
      pathRewrite: {
        '^/products': '/api/v1/products',
      },
      onError: (err, req, res) => {
        const prodUrl = 'https://holo-henna.onrender.com'
        res.redirect(307, `${prodUrl}/api/v1/products${req.url}`)
      },
    })
  )

  // Orders endpoint proxy with fallback
  app.use(
    '/api/v1/orders',
    createProxyMiddleware({
      ...proxyConfig,
      onError: (err, req, res) => {
        if (err.code === 'ECONNREFUSED') {
          return res.redirect(
            `https://holo-henna.onrender.com/api/v1/orders${req.url}`
          )
        }
        res.writeHead(500, {
          'Content-Type': 'application/json',
        })
        res.end(
          JSON.stringify({
            success: false,
            message: 'Backend server is not available.',
            error:
              process.env.NODE_ENV === 'development' ? err.message : undefined,
          })
        )
      },
    })
  )

  // Handle React routes for orders
  app.get(['/orders', '/orders/*'], (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
  })

  // Health check endpoint
  app.use(
    '/health',
    createProxyMiddleware({
      ...proxyConfig,
      pathRewrite: { '^/health': '/api/v1/health' },
    })
  )
}
