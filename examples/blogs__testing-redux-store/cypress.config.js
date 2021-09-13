const { defineConfig } = require("cypress")

const { initPlugin } = require("cypress-plugin-snapshots/plugin")

module.exports = defineConfig({
  baseUrl: "http://localhost:3000",
  ignoreTestFiles: ["**/*.snap", "**/__snapshot__/*"],

  env: {
    "cypress-plugin-snapshots": {},
  },

  e2e: {
    setupNodeEvents(on, config) {
      initPlugin(on, config)
      return config
    },
  },
})
