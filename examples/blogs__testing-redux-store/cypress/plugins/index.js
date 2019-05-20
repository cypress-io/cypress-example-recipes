const { initPlugin } = require('cypress-plugin-snapshots/plugin')
module.exports = (on, config) => {
  initPlugin(on, config)

  on('task', require('cypress-istanbul/task'))
  on('file:preprocessor', require('cypress-istanbul/use-babelrc'))

  return config
}
