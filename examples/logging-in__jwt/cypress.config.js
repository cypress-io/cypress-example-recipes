const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:8081",
  env: {
    username: "test",
    password: "test",
  },
  fixturesFolder: false,
  supportFile: false,
})
