const { defineConfig } = require("cypress")

module.exports = defineConfig({
  viewportHeight: 100,
  viewportWidth: 100,
  pluginsFile: false,
  supportFile: false,
  fixturesFolder: false,
})
