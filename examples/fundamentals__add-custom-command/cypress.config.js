const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  viewportHeight: 200,
  viewportWidth: 300,
  fixturesFolder: false,
  e2e: {},
})
