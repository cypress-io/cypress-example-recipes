const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    'cypress-plugin-snapshots': {},
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    excludeSpecPattern: ['**/*.snap", "**/__snapshot__/*'],
  },
})
