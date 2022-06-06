const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultCommandTimeout: 8000,
  e2e: {
    baseUrl: 'http://localhost:7080',
    supportFile: false,
    excludeSpecPattern: 'deferred.js',
    setupNodeEvents (on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'firefox') {
          // One of the tests uses <a ping="..."> feature that
          // is behind a flag in Firefox browser.
          // We can programmatically enable an option
          // in Firefox using launch options
          launchOptions.preferences['browser.send_pings'] = true
        }

        // whatever you return here becomes the launchOptions
        return launchOptions
      })
    },
  },
})
