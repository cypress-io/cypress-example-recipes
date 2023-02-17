const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    baseUrl: 'http://localhost:7079',
    supportFile: false,
  },
})
