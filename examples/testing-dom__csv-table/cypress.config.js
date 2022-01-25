const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportWidth: 500,
  viewportHeight: 1000,
  e2e: {
    supportFile: false,
  },
})
