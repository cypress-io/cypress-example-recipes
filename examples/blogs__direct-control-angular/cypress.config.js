const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl: 'http://todomvc.com/examples/angularjs',
  fixturesFolder: false,
  e2e: {
    supportFile: false,
  },
})
