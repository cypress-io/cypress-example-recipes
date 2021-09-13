const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7065",
  fixturesFolder: false,
  pluginsFile: false,
  supportFile: false,
  viewportHeight: 200,
  viewportWidth: 200,
})
