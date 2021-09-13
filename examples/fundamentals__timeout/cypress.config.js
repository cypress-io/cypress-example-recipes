const { defineConfig } = require("cypress")

module.exports = defineConfig({
  fixturesFolder: false,
  pluginsFile: false,
  supportFile: false,
  testFiles: "**/*spec.js",
})
