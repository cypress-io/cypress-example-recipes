const { defineConfig } = require("cypress")

const browserify = require("@cypress/browserify-preprocessor")

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    setupNodeEvents(on, config) {
      const options = browserify.defaultOptions
      options.browserifyOptions.transform[1][1].presets.push(
        "@babel/preset-flow"
      )
      on("file:preprocessor", browserify(options))
    },
  },
})
