const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: false,
  viewportWidth: 400,
  viewportHeight: 300,
  e2e: {
    supportFile: false,
  },
})
