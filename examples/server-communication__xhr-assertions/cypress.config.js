const { defineConfig } = require("cypress")

module.exports = defineConfig({
  fixturesFolder: false,
  supportFile: false,
  viewportHeight: 300,
  viewportWidth: 500,
})
