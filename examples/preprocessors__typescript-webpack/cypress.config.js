const { defineConfig } = require('cypress')

const wp = require('@cypress/webpack-preprocessor')

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents (on, config) {
      const options = {
        webpackOptions: require('./webpack.config'),
      }

      on('file:preprocessor', wp(options))
    },
  },
})
