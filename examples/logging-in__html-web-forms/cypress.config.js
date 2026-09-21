const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: false,
  e2e: {
    baseUrl: 'http://localhost:7077',
    supportFile: false,
  },
})
