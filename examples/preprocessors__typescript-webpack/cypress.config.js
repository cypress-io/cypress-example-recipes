const wp = require('@cypress/webpack-preprocessor')

module.exports = (on) => {
  const options = {
    webpackOptions: require('../../webpack.config'),
  }

  on('file:preprocessor', wp(options))
}
const json = {
  "supportFile": "cypress/support/index.ts",
  "fixturesFolder": false
}