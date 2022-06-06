const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  defaultCommandTimeout: 1000,
  e2e: {
    baseUrl: 'http://localhost:58000/',
    supportFile: false,
  },
})
