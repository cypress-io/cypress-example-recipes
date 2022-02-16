const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    baseUrl: 'http://todomvc.com/examples/angularjs',
    supportFile: false,
  },
})
