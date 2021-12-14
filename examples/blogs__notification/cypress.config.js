const { defineConfig } = require("cypress")

module.exports = defineConfig({
  supportFile: false,
  fixturesFolder: false,
  viewportHeight: 100,
  viewportWidth: 200,
})
