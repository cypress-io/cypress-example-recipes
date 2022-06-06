const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: 'cypress/fixtures',
  e2e: {
    supportFile: false,
  },
})
