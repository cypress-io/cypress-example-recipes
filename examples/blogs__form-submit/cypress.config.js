const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: false,
  defaultCommandTimeout: 1000,
  e2e: {
    baseUrl: 'http://localhost:58000/',
    supportFile: false,
  },
})
