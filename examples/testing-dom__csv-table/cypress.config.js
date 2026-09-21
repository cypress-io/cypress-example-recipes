const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: false,
  viewportWidth: 500,
  viewportHeight: 1000,
  e2e: {
    supportFile: false,
  },
})
