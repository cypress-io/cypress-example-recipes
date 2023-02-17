const { defineConfig } = require('cypress')

const { seed } = require('./server/db')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:7082',
    supportFile: false,
    setupNodeEvents (on, config) {
      on('task', {
        'seed:db' (data) {
          return seed(data).then(() => {
            return data
          })
        },
      })
    },
  },
})
