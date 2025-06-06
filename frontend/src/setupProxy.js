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
      console.log(`[Proxy] ${req.method} ${req.url} -> ${proxyReq.path}`)
    },
    onError: (err, req, res) => {
      if (err.code === 'ECONNREFUSED') {
        // Fallback to production URL
        const prodUrl = 'https://holo-henna.onrender.com'
        res.redirect(`${prodUrl}/api/v1${req.url}`)
        return
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
  }

  // Handle React routes that need direct access
  const reactRoutes = ['/order-success', '/orders', '/products']
  reactRoutes.forEach((route) => {
    app.get(`${route}/*`, (req, res, next) => {
      if (
        req.url.includes('favicon.ico') ||
        req.url.includes('manifest.json')
      ) {
        res.sendFile(
          path.join(__dirname, '../public', req.url.replace(/%PUBLIC_URL%/g, ''))
        )
        return
      }
      if (req.url.startsWith('/api')) {
        return next()
      }
      res.sendFile(path.join(__dirname, '../public/index.html'))
    })
  })

  // Static files handling first
  app.use('/static', express.static(path.join(__dirname, '../public')))
  app.use(
    '/favicon.ico',
    express.static(path.join(__dirname, '../public/favicon.ico'))
  )

  // API endpoints proxy
  app.use(
    '/api/v1',
    createProxyMiddleware({
      ...proxyConfig,
      pathRewrite: undefined, // Don't rewrite paths for /api/v1
      onError: (err, req, res) => {
        if (err.code === 'ECONNREFUSED') {
          return res.redirect(`https://holo-henna.onrender.com${req.url}`)
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

  // Health check endpoint
  app.use(
    '/health',
    createProxyMiddleware({
      ...proxyConfig,
      pathRewrite: { '^/health': '/api/v1/health' },
    })
  )
}
