const { defineConfig } = require('cypress')

/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

const findRecord = (title) => {
  const dbFilename = path.join(__dirname, 'data.json')
  const contents = JSON.parse(fs.readFileSync(dbFilename))
  const todos = contents.todos

  return todos.find((record) => record.title === title)
}

const hasRecordAsync = (title, ms) => {
  const delay = 50

  return new Promise((resolve, reject) => {
    if (ms < 0) {
      return reject(new Error(`Could not find record with title "${title}"`))
    }

    const found = findRecord(title)

    if (found) {
      return resolve(found)
    }

    setTimeout(() => {
      hasRecordAsync(title, ms - delay).then(resolve, reject)
    }, 50)
  })
}

module.exports = defineConfig({
  video: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    setupNodeEvents (on, config) {
      // `on` is used to hook into various events Cypress emits
      // `config` is the resolved Cypress config
      on('task', {
        hasSavedRecord (title, ms = 3000) {
          console.log('looking for title "%s" in the database (time limit %dms)',
            title, ms)

          return hasRecordAsync(title, ms)
        },

        testTimings (attributes) {
          console.log('Test "%s" has finished in %dms', attributes.title, attributes.duration)

          console.table(attributes.commands)

          return null
        },
      })
    },
  },
})
