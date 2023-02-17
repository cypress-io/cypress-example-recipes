const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 200,
  viewportWidth: 200,
  e2e: {
    baseUrl: 'http://localhost:7065',
    supportFile: false,
  },
})
