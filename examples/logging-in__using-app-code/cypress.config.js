const webpack = require("@cypress/webpack-preprocessor")

module.exports = (on) => {
  // bundle spec files using same webpack logic as "normal" application
  const options = {
    // send in the options from your webpack.config.js, so it works the same
    // as your app's code
    webpackOptions: require("../../webpack.config"),
    watchOptions: {},
  }

  on("file:preprocessor", webpack(options))
}
const json = {
  baseUrl: "http://localhost:8081",
  env: {
    username: "test",
    password: "test",
  },
  supportFile: false,
}
