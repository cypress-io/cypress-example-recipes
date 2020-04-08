const browserify = require('@cypress/browserify-preprocessor')

module.exports = (on) => {
  const options = {
    typescript: require.resolve('typescript'),
  }

  on('file:preprocessor', browserify(options))
}
