const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  supportFile: false,
  viewportHeight: 300,
  viewportWidth: 500,
  baseUrl: 'http://localhost:7668',
  defaultCommandTimeout: 1000,
  requestTimeout: 1000,
})
