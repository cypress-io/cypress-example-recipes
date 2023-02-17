const { defineConfig } = require('cypress')

const tasks = require('./cypress/plugins/tasks')

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    supportFile: false,
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
