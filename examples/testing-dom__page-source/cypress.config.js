const { defineConfig } = require("cypress")

module.exports = defineConfig({
  fixturesFolder: false,
  supportFile: false,
  pluginsFile: false,
  baseUrl: "https://www.cypress.io/",
})
