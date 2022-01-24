const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:58000/",
  fixturesFolder: false,
  defaultCommandTimeout: 1000,
  e2e: {
    supportFile: false,
  },
})
