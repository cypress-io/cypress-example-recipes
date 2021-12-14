const { defineConfig } = require("cypress")

const wp = require("@cypress/webpack-preprocessor")

module.exports = defineConfig({
  supportFile: "cypress/support/index.ts",
  fixturesFolder: false,
  e2e: {
    setupNodeEvents(on, config) {
      const options = {
        webpackOptions: require("../../webpack.config"),
      }

      on("file:preprocessor", wp(options))
    },
  },
})
