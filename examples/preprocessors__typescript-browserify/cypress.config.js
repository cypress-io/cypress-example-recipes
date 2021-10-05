const { defineConfig } = require("cypress")

const browserify = require("@cypress/browserify-preprocessor")

module.exports = defineConfig({
  fixturesFolder: false,
  supportFile: false,
  e2e: {
    setupNodeEvents(on, config) {
      const options = {
        typescript: require.resolve("typescript"),
      }

      on("file:preprocessor", browserify(options))
    },
  },
})
