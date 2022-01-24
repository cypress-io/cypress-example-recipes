const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:3000",
  fixturesFolder: false,
  e2e: {
    supportFile: false,
  },
})
