const { defineConfig } = require('cypress')

module.exports = defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 1000,
  fixturesFolder: false,
  retries: {
    runMode: 2,
    openMode: 0,
  },
})
