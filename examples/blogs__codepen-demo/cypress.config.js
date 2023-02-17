const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: false,
  e2e: {
    supportFile: false,
  },
})
