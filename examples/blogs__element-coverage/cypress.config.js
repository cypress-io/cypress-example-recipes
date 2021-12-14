const { defineConfig } = require('cypress')

module.exports = defineConfig({
  baseUrl: 'http://localhost:3000',
  env: {
    'cypress-plugin-snapshots': {},
  },
  e2e: {
    specExcludePattern: ['**/*.snap", "**/__snapshot__/*'],
  },
})
