const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
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
