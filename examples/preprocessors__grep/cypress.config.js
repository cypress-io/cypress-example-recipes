const { defineConfig } = require("cypress")

const selectTestsWithGrep = require("cypress-select-tests/grep")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("file:preprocessor", selectTestsWithGrep(config))
    },
  },
})
