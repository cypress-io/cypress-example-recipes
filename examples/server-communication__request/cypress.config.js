/* eslint-disable no-console */
const { defineConfig } = require('cypress')

const got = require('got')

module.exports = defineConfig({
  fixturesFolder: false,
  viewportHeight: 200,
  viewportWidth: 300,
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    setupNodeEvents (on, config) {
      on('task', {
        httpRequest (params) {
          console.log('making the HTTP request:')
          console.log(params)

          // use the "got" module to make HTTP requests
          // https://github.com/sindresorhus/got#readme
          return got(params).then((r) => r.body)
        },
      })
    },
  },
})
