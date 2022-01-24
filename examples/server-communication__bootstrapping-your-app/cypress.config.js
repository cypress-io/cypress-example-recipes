const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7070",
  e2e: {
    supportFile: false,
  },
})
