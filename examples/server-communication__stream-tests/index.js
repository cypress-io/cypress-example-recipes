const cypress = require('cypress')

/* eslint-disable no-console */

cypress.run().then((results) => {
  console.log('all done ✔️')
  // console.log('%o', results)
}, (err) => {
  console.error(err.message)
  process.exit(1)
})
