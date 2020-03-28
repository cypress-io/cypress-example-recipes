/// <reference types="cypress" />

/* eslint-disable no-console */

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('task', {
    testFinished (attributes) {
      // console.log(name)
      console.log('%s: "%s" %dms', attributes.state, attributes.title, attributes.duration)

      return null
    },
  })
}
