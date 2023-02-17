const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportWidth: 500,
  viewportHeight: 400,
  defaultCommandTimeout: 8000,
  e2e: {
    baseUrl: 'http://localhost:7080',
    supportFile: false,
  },
})
