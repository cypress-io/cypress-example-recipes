const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7074",
  hosts: {
    "auth.corp.com": "127.0.0.1",
  },
  fixturesFolder: false,
})
