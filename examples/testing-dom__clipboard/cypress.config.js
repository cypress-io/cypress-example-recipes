const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportWidth: 400,
  viewportHeight: 300,
  e2e: {
    supportFile: false,
  },
})
