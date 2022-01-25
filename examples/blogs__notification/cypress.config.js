const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 100,
  viewportWidth: 200,
  e2e: {
    supportFile: false,
  },
})
