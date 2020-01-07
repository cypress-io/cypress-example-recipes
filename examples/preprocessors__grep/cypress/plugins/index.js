const selectTestsWithGrep = require('cypress-select-tests/grep')

module.exports = (on, config) => {
  on('file:preprocessor', selectTestsWithGrep(config))
}
