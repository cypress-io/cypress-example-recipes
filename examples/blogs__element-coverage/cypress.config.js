const { defineConfig } = require('cypress')
const webpackPreprocessor = require('@cypress/webpack-batteries-included-preprocessor')

function getWebpackOptions () {
  const options = webpackPreprocessor.getFullWebpackOptions()

  options.resolve.fallback.crypto = require.resolve('crypto-browserify')

  return options
}

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents (on, config) {
      on(
        'file:preprocessor',
        webpackPreprocessor({
          webpackOptions: getWebpackOptions(),
        })
      )

      return config
    },
  },
})
