/// <reference types="cypress" />
const got = require('got')

/* eslint-disable no-console */

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('task', {
    httpRequest (params) {
      console.log('making the HTTP request:')
      console.log(params)

      // use the "got" module to make HTTP requests
      // https://github.com/sindresorhus/got#readme
      return got(params).then((r) => r.body)
    },
  })
}
