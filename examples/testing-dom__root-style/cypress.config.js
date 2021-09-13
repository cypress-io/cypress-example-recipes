const { defineConfig } = require("cypress")

module.exports = defineConfig({
  fixturesFolder: false,
  supportFile: false,
  pluginsFile: false,
  viewportWidth: 300,
  viewportHeight: 300,
})
