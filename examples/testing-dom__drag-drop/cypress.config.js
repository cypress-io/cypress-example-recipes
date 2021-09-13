const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7071",
  fixturesFolder: false,
  pluginsFile: false,
  supportFile: false,
})
