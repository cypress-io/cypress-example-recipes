const { defineConfig } = require('cypress')
const webpackPreprocessor = require('@cypress/webpack-batteries-included-preprocessor')

function getWebpackOptions () {
  const options = webpackPreprocessor.getFullWebpackOptions()

  options.resolve.fallback.crypto = require.resolve('crypto-browserify')

  return options
}

module.exports = defineConfig({
  env: {
    'cypress-plugin-snapshots': {},
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    excludeSpecPattern: ['**/*.snap", "**/__snapshot__/*'],
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
