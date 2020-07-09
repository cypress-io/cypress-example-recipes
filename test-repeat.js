/* eslint-disable no-console */
// a small utility script to run Cypress N times

// if there is an .env file, lots it and add to process.env
require('dotenv').config()

const arg = require('arg')
const cypress = require('cypress')

const args = arg({
  '-n': Number,
  '--group': String,
})

const runOptions = {}

if (process.env.CYPRESS_RECORD_KEY) {
  runOptions.record = true
  runOptions.group = args['--group']
}

const onTestResults = (testResults) => {
  if (testResults.failures) {
    console.error(testResults.message)
    process.exit(testResults.failures)
  }

  process.exit(testResults.totalFailed)
}

const onError = (err) => {
  console.error(err)
  process.exit(1)
}

cypress.run(runOptions).then(onTestResults, onError)
