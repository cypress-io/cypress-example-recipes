const { defineConfig } = require("cypress")

module.exports = defineConfig({
  viewportHeight: 200,
  viewportWidth: 300,
  pluginsFile: false,
  fixturesFolder: false,
})
