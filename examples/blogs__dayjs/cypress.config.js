const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  fixturesFolder: false,
  viewportWidth: 500,
  viewportHeight: 200,
  e2e: {},
})
