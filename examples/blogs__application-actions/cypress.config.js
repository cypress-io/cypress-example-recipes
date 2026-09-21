const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: false,
  defaultCommandTimeout: 8000,
  e2e: {
    baseUrl: 'http://localhost:8888',
    excludeSpecPattern: 'utils.js',
  },
})
