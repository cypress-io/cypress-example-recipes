/* eslint-disable no-console */
const { send, createError } = require('micro')

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing
const formatServerTiming = (items) => {
  const toTiming = (item) => {
    return `${item.name};desc="${item.description}";dur=${item.duration}`
  }

  return items.map(toTiming).join(', ')
}

module.exports = async (req, res) => {
  if (req.url === '/favicon.ico') {
    return send(res, 404)
  }

  if (req.url === '/') {
    res.setHeader('Content-Type', 'text/html')
    const value = formatServerTiming([{
      name: 'cache',
      description: 'my example',
      duration: 2002,
    }])

    res.setHeader('Server-Timing', value)

    return send(res, 200, '<body><h1>Hi there</h1></body>')
  }

  console.log('req "%s"', req.url)
  throw createError(500, 'Unknown path')
}
