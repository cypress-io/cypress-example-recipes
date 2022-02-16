const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 600,
  viewportWidth: 300,
  e2e: {
    baseUrl: 'http://localhost:4500',
  },
})
