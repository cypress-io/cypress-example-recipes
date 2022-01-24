const { defineConfig } = require("cypress")

const webpack = require("@cypress/webpack-preprocessor")

module.exports = defineConfig({
  baseUrl: "http://localhost:8081",
  env: {
    username: "test",
    password: "test",
  },
  e2e: {
    supportFile: false,
    setupNodeEvents(on, config) {
      // bundle spec files using same webpack logic as "normal" application
      const options = {
        // send in the options from your webpack.config.js, so it works the same
        // as your app's code
        webpackOptions: require("./webpack.config"),
        watchOptions: {},
      }

      on("file:preprocessor", webpack(options))
    },
  },
})
