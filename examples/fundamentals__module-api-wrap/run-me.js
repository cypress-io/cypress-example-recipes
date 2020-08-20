// runs Cypress end-to-end tests using Cypress Node module API
// https://on.cypress.io/module-api

/* eslint-disable no-console */

const cypress = require('cypress')

cypress.cli.parseRunArguments(process.argv.slice(2))
.then((runOptions) => {
  console.log('Parsed cypress run options:')
  console.log(runOptions)

  return runOptions
})
.then(cypress.run)
.then((results) => {
  if (results.failures) {
    // means really bad error, could not run tests
    console.error('Failed to run Cypress')
    console.error(results.message)
    process.exit(1)
  }

  console.log('Cypress run results: %d total tests, %d passed, %d failed',
    results.totalTests, results.totalPassed, results.totalFailed)

  process.exit(results.totalFailed)
})
