const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7077",
  fixturesFolder: false,
  pluginsFile: false,
  supportFile: false,
})
