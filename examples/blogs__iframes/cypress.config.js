const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  chromeWebSecurity: false,
  viewportHeight: 1000,
  fixturesFolder: false,
  retries: {
    runMode: 5,
  },
  e2e: {},
})
