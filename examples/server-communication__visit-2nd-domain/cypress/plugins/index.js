/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // the URL will set by the first test
  let href

  on('task', {
    saveUrl (url) {
      href = url

      // cy.task() requires returning a Promise
      // or anything BUT undefined to signal that
      // the task is finished
      // see https://on.cypress.io/task
      return null
    },

    getUrl () {
      return href
    },
  })
}
