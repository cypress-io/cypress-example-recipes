const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    baseUrl: 'https://www.cypress.io/',
    supportFile: false,
  },
})
