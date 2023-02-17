/* eslint-disable no-console */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    supportFile: false,
    setupNodeEvents (on, config) {
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
    },
  },
})
