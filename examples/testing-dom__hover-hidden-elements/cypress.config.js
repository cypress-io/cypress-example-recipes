const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl: 'http://localhost:7073',
  fixturesFolder: false,
  e2e: {
    supportFile: false,
  },
})
