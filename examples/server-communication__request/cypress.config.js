const { defineConfig } = require("cypress")

/// <reference types="cypress" />
const got = require("got")

module.exports = defineConfig({
  baseUrl: "http://localhost:3000",
  fixturesFolder: false,
  supportFile: false,
  viewportHeight: 200,
  viewportWidth: 300,

  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        httpRequest(params) {
          console.log("making the HTTP request:")
          console.log(params)

          // use the "got" module to make HTTP requests
          // https://github.com/sindresorhus/got#readme
          return got(params).then((r) => r.body)
        },
      })
    },
  },
})
