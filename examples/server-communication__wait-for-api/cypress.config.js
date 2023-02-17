const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 300,
  viewportWidth: 500,
  defaultCommandTimeout: 1000,
  requestTimeout: 1000,
  e2e: {
    baseUrl: 'http://localhost:7668',
    supportFile: false,
  },
})
