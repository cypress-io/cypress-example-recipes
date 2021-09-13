const { defineConfig } = require("cypress")

module.exports = defineConfig({
  viewportHeight: 500,
  viewportWidth: 500,
  pluginsFile: false,
  supportFile: false,
  fixturesFolder: false,
})
