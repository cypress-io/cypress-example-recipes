const { defineConfig } = require('cypress')

const tasks = require('./tasks')

module.exports = defineConfig({
  supportFile: false,
  fixturesFolder: false,
  e2e: {
    setupNodeEvents (on, config) {
      on('task', tasks)

      // only filter browsers if we are passed a list - this way
      // this example works on Cypress v3.7.0+ and below
      if (!config.browsers) {
        return
      }

      // Cypress v4.0.0+
      return {
        browsers: config.browsers.filter(
          (browser) => browser.name === 'electron'
        ),
      }
    },
  },
})
