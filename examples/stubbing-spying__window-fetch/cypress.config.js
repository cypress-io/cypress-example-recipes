const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: false,
  experimentalFetchPolyfill: true,
  e2e: {
    baseUrl: 'http://localhost:7080',
    excludeSpecPattern: 'deferred.js',
  },
})
