const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7065",
  fixturesFolder: false,
  viewportHeight: 200,
  viewportWidth: 200,
  e2e: {
    supportFile: false,
  }
})
