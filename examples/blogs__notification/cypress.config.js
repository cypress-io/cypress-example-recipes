const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: false,
  viewportHeight: 100,
  viewportWidth: 200,
  e2e: {
    supportFile: false,
  },
})
