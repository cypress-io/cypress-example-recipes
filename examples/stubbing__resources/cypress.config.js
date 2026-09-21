const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: 'cypress/fixtures',
  e2e: {
    supportFile: false,
  },
})
