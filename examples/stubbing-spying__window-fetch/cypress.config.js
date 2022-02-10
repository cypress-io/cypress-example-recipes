const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl: 'http://localhost:7080',
  fixturesFolder: false,
  experimentalFetchPolyfill: true,
  e2e: {
    excludeSpecPattern: 'deferred.js',
  },
})
