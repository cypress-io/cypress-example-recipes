const { defineConfig } = require("cypress")

module.exports = defineConfig({
  supportFile: false,
  defaultCommandTimeout: 3000,
  retries: {
    runMode: 2,
    openMode: 0,
  },
})
