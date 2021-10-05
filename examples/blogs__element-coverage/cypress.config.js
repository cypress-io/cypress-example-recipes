const { defineConfig } = require("cypress")

module.exports = defineConfig({
  baseUrl: "http://localhost:3000",
  ignoreTestFiles: ["**/*.snap\", \"**/__snapshot__/*"],
  env: {
    "cypress-plugin-snapshots": {},
  },
})
