const { defineConfig } = require('cypress')

module.exports = defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3700',
    setupNodeEvents (on, config) {
      // `on` is used to hook into various events Cypress emits
      // `config` is the resolved Cypress config
      on('task', {
        failed: require('cypress-failed-log/src/failed')(),
      })
    },
  },
})
