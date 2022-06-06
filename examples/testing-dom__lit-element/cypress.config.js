const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  experimentalShadowDomSupport: true,
  e2e: {
    supportFile: false,
  },
})
