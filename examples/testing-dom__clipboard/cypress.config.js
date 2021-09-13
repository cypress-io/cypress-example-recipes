const { defineConfig } = require("cypress")

module.exports = defineConfig({
  fixturesFolder: false,
  supportFile: false,
  pluginsFile: false,
  viewportWidth: 400,
  viewportHeight: 300,
})
