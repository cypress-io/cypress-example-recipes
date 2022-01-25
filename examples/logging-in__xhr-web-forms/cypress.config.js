const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl: 'http://localhost:7079',
  fixturesFolder: false,
  e2e: {
    supportFile: false,
  },
})
