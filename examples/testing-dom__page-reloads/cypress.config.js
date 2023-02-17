const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 100,
  viewportWidth: 100,
  e2e: {
    supportFile: false,
  },
})
