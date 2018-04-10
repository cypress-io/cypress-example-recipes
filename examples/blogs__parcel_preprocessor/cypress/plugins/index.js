const onFile = (file) => {
  console.log('onFile', file)
}

module.exports = (on, config) => {
  on('file:preprocessor', onFile)
}
