const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  experimentalFetchPolyfill: true,
  e2e: {
    baseUrl: 'http://localhost:7080',
    excludeSpecPattern: 'deferred.js',
  },
})
