const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7070",
  pluginsFile: false,
  supportFile: false,
})
