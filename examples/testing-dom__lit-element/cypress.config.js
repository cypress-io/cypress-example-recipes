const { defineConfig } = require("cypress")

module.exports = defineConfig({
  pluginsFile: false,
  supportFile: false,
  fixturesFolder: false,
  experimentalShadowDomSupport: true,
})
