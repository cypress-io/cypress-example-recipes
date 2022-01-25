const { defineConfig } = require('cypress')

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    supportFile: false,
    setupNodeEvents (on, config) {
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
    },
  },
})
