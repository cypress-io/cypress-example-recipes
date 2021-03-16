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

/* eslint-disable no-console */

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  const items = {}

  // cy.task() requires returning a Promise
  // or anything BUT undefined to signal that
  // the task is finished
  // see https://on.cypress.io/task
  on('task', {
    setItem ({ name, value }) {
      console.log('setting %s', name)
      if (typeof value === 'undefined') {
        // since we cannot return undefined from the cy.task
        // let's not allow storing undefined
        throw new Error(`Cannot store undefined value for item "${name}"`)
      }

      items[name] = value

      return null
    },

    getItem (name) {
      if (name in items) {
        console.log('returning item %s', name)

        return items[name]
      }

      const msg = `Missing item "${name}"`

      console.error(msg)
      throw new Error(msg)
    },
  })
}
