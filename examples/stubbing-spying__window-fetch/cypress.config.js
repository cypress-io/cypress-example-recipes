const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:7080",
  ignoreTestFiles: "deferred.js",
  fixturesFolder: false,
  pluginsFile: false,
  experimentalFetchPolyfill: true,
})
