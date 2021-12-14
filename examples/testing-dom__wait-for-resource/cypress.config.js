const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:4500",
  viewportHeight: 600,
  viewportWidth: 300,
})
