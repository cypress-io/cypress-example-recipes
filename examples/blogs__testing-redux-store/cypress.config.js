const { initPlugin } = require('cypress-plugin-snapshots/plugin')

module.exports = (on, config) => {
  initPlugin(on, config)

  return config
}
const json = {
  "baseUrl": "http://localhost:3000",
  "ignoreTestFiles": [
    "**/*.snap",
    "**/__snapshot__/*"
  ],
  "env": {
    "cypress-plugin-snapshots": {}
  }
}