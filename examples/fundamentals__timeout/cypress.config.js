const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  supportFile: false,
  specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
})
