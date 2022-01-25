const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 300,
  viewportWidth: 500,
  e2e: {
    supportFile: false,
  },
})
