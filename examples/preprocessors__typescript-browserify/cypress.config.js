const { defineConfig } = require('cypress')

const browserify = require('@cypress/browserify-preprocessor')

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    supportFile: false,
    setupNodeEvents (on, config) {
      const options = {
        typescript: require.resolve('typescript'),
      }

      on('file:preprocessor', browserify(options))
    },
  },
})
