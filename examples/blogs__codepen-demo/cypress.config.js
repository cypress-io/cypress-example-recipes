const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  chromeWebSecurity: false,
  fixturesFolder: false,
  e2e: {
    supportFile: false,
  },
})
