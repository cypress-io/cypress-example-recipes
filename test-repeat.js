/* eslint-disable no-console */
// a small utility script to run Cypress N times
// use (from examples/X folder)
//    node ../../test-repeat.js -n 3
// if you want to record, a good idea is to pass a group name
//    node ../../test-repeat.js -n 3 --group my-example

// if there is an .env file, lots it and add to process.env
require('dotenv').config()

const arg = require('arg')
const cypress = require('cypress')
const Bluebird = require('bluebird')

const args = arg({
  '-n': Number,
  '--group': String,
})

const repeatNtimes = args['-n'] ? args['-n'] : 1

console.log('will repeat Cypress run %d time(s)', repeatNtimes)

const allRunOptions = []

for (let k = 0; k < repeatNtimes; k += 1) {
  const runOptions = {}

  if (process.env.CYPRESS_RECORD_KEY) {
    runOptions.record = true
    runOptions.group = args['--group']

    if (runOptions.group && repeatNtimes > 1) {
      // make sure if we are repeating this example
      // then the recording has group names on the Dashboard
      // like "example-1-of-20", "example-2-of-20", ...
      runOptions.group += `-${k + 1}-of-${repeatNtimes}`
    }
  }

  allRunOptions.push(runOptions)
}

const onError = (err) => {
  console.error(err)
  process.exit(1)
}

Bluebird.mapSeries(allRunOptions, (runOptions, k, n) => {
  console.log('***** %d of %d *****', k + 1, n)

  const onTestResults = (testResults) => {
    if (testResults.failures) {
      console.error(testResults.message)
      process.exit(testResults.failures)
    }

    if (testResults.totalFailed) {
      console.error('run %d of %d failed', k + 1, n)
      process.exit(testResults.totalFailed)
    }
  }

  return cypress.run(runOptions).then(onTestResults)
}).then(() => {
  console.log('***** finished %d run(s) successfully *****', repeatNtimes)
})
.catch(onError)
