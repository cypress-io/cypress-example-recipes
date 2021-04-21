/* eslint-disable no-console */
const { send, createError } = require('micro')
const parseCookies = require('micro-cookie')

module.exports = parseCookies(async (req, res) => {
  if (req.url === '/favicon.ico') {
    return send(res, 404)
  }

  console.log('%s "%s"', req.method, req.url)

  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html')
    res.setHeader('Set-Cookie', 'mycookie=testcookie')

    return send(res, 200, '<body><h1>Hi there</h1></body>')
  }

  if (req.url === '/print-cookies') {
    // res.setHeader('Content-Type', 'application/json')
    console.log('=== all cookies 🍪 ===')
    console.log(req.cookies)

    return send(res, 200, req.cookies || {})
  }

  throw createError(500, 'Unknown path')
})
