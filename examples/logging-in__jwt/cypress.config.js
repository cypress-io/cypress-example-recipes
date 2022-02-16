const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  env: {
    username: 'test',
    password: 'test',
  },
  e2e: {
    baseUrl: 'http://localhost:8081',
    supportFile: false,
  },
})
