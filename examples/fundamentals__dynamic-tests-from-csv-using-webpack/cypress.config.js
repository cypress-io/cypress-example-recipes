/* eslint-disable no-console */
const webpackPreprocessor = require('@cypress/webpack-preprocessor')
const { defineConfig } = require('cypress')

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
module.exports = defineConfig({
  e2e: {
    supportFile: false,
    setupNodeEvents (on, config) {
      // implement node event listeners here
      const webpackDefaults = webpackPreprocessor.defaultOptions

      webpackDefaults.webpackOptions.module.rules.push({
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true,
          header: true,
          skipEmptyLines: true,
        },
      })

      on('file:preprocessor', webpackPreprocessor(webpackDefaults))
    },
  },
})
