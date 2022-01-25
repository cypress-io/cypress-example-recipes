const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 200,
  viewportWidth: 250,
  e2e: {
    supportFile: false,
    setupNodeEvents (on, config) {
      // `on` is used to hook into various events Cypress emits
      // `config` is the resolved Cypress config
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--enable-logging', '--v=1')

          return launchOptions
        }
      })
    },
  },
})
