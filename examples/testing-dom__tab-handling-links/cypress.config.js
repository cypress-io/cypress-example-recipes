const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7078",
  fixturesFolder: false,
  pluginsFile: false,
  supportFile: false,
})
