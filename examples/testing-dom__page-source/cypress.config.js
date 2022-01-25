const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl: 'https://www.cypress.io/',
  fixturesFolder: false,
  e2e: {
    supportFile: false,
  },
})
