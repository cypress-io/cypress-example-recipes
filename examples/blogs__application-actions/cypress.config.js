const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:8888",
  fixturesFolder: false,
  defaultCommandTimeout: 8000,
  e2e: {
    specExcludePattern: "utils.js",
  }
})
