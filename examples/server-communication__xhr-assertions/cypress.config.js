const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 300,
  viewportWidth: 500,
  pageLoadTimeout: 100000,
  requestTimeout: 10000,
  e2e: {
    supportFile: false,
  },
})
