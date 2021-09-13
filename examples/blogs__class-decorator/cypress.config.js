const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:1234",
  fixturesFolder: false,
  supportFile: false,
  pluginsFile: false,
})
