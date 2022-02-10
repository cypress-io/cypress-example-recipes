const { defineConfig } = require('cypress')

const { initPlugin } = require('cypress-plugin-snapshots/plugin')

module.exports = defineConfig({
  env: {
    'cypress-plugin-snapshots': {},
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
    excludeSpecPattern: ['**/*.snap', '**/__snapshot__/*'],
    setupNodeEvents (on, config) {
      initPlugin(on, config)

      return config
    },
  },
})
