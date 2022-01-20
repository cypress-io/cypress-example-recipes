const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents (on, config) {
      // e2e testing node events setup code
      console.log('setupNodeEvents config:', config)
    },
  },
})
