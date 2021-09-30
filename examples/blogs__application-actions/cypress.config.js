const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl: 'http://localhost:8888',
  ignoreTestFiles: 'utils.js',
  fixturesFolder: false,
  defaultCommandTimeout: 8000,
})
