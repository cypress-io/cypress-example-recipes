const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl: 'http://localhost:8081',
  fixturesFolder: false,
  env: {
    username: 'test',
    password: 'test',
  },
  e2e: {
    supportFile: false,
  },
})
