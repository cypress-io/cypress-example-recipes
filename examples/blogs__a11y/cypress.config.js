const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    specPattern: '**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
  },
})
