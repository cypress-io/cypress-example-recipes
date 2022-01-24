const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7080",
  fixturesFolder: false,
  viewportWidth: 500,
  viewportHeight: 400,
  defaultCommandTimeout: 8000,
  e2e: {
    supportFile: false,
  },
})
