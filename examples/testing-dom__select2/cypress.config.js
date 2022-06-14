const { defineConfig } = require('cypress')

module.exports = defineConfig({
  defaultCommandTimeout: 3000,
  retries: {
    runMode: 5,
  },
  e2e: {
    supportFile: false,
  },
})
