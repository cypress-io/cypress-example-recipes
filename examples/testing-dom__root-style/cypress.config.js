const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: false,
  viewportWidth: 300,
  viewportHeight: 300,
  e2e: {
    supportFile: false,
  },
})
