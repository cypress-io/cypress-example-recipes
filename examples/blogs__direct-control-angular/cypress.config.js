const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://todomvc.com/examples/angularjs",
  fixturesFolder: false,
  supportFile: false,
})
