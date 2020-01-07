const path = require('path')

/* eslint-disable no-console */

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('before:browser:launch', (browser, args) => {
    console.log('launching browser %o', browser)

    // only load React DevTools extension when opening Chrome in interactive mode
    if (browser.family === 'chrome') {
      // we could also restrict the extension to only load when browser.isHeaded is true
      const extensionFolder = path.resolve(__dirname, '..', '..', '4.2.1_0')

      console.log('adding React DevTools extension from', extensionFolder)
      args.push(`--load-extension=${extensionFolder}`)

      return args
    }
  })
}
