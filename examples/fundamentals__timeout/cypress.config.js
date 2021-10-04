const { defineConfig } = require("cypress")

module.exports = defineConfig({
  fixturesFolder: false,
  supportFile: false,
  testFiles: "**/*spec.js",
})
