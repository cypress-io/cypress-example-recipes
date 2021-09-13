const { defineConfig } = require("cypress")

module.exports = defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: false,
  pluginsFile: false,
  supportFile: false,
})
