const { defineConfig } = require('cypress')

// This enables using import/export
// and any files it requires
//
// Support for other syntax and features (not supported
// by the version of node run by Cypress) can
// be configured via babel plugins in the .babelrc

require('babel-register')

module.exports = defineConfig({
  baseUrl: 'http://localhost:7082',
  supportFile: false,
  e2e: {
    setupNodeEvents () {
      require('./main').default
    },
  },
})
