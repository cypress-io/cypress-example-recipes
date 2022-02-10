const { defineConfig } = require('cypress')

const { initPlugin } = require('cypress-plugin-snapshots/plugin')

module.exports = defineConfig({
  baseUrl: 'http://localhost:3000',
  env: {
    'cypress-plugin-snapshots': {},
  },
  e2e: {
    excludeSpecPattern: ['**/*.snap', '**/__snapshot__/*'],
    setupNodeEvents (on, config) {
      initPlugin(on, config)

      return config
    },
  },
})
