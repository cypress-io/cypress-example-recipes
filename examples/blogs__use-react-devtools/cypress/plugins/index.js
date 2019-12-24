const path = require('path')

/* eslint-disable no-console */

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.family === 'chrome') {
      const extensionFolder = path.resolve(__dirname, '..', '..', '4.2.1_0')

      console.log('adding React DevTools extension from', extensionFolder)
      args.push(`--load-extension=${extensionFolder}`)

      return args
    }
  })
}
