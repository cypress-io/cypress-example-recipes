const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultBrowser: 'chrome',
  defaultCommandTimeout: 3000,
  retries: {
    runMode: 5,
  },
  e2e: {
    supportFile: false,
  },
})
