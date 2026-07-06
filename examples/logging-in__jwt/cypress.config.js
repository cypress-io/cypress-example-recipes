const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  // sensitive values stay server-side in "env" and are read with cy.env()
  env: {
    username: 'test',
  },
  e2e: {
    baseUrl: 'http://localhost:8081',
    supportFile: false,
    setupNodeEvents (on, config) {
      on('task', {
        getUserPassword () {
          return {
            password: 'test',
          }
        },
      })

      return config
    },
  },
})
