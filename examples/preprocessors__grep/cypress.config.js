const { defineConfig } = require('cypress')

const selectTestsWithGrep = require('cypress-select-tests/grep')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  e2e: {
    supportFile: false,
    setupNodeEvents (on, config) {
      on('file:preprocessor', selectTestsWithGrep(config))
    },
  },
})
