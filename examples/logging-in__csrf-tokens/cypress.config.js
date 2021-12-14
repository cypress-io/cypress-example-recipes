const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl: 'http://localhost:7076',
  fixturesFolder: false,
  supportFile: false,
})
