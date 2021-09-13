const { defineConfig } = require("cypress")

module.exports = defineConfig({
  pluginsFile: false,
  supportFile: false,
  fixturesFolder: false,
  viewportHeight: 100,
  viewportWidth: 200,
})
