// runs Cypress end-to-end tests using Cypress Node module API
// https://on.cypress.io/module-api

/* eslint-disable no-console */

const cypress = require('cypress')
const globby = require('globby')
const Promise = require('bluebird')
const fs = require('fs')

require('console.table')

/**
 * Sorts by "time" property, putting larger numbers first
 */
const byTime = (a, b) => b.time - a.time

const sortByLastModified = (filenames) => {
  const withTimes = filenames.map((filename) => {
    return {
      filename,
      time: fs.statSync(filename).mtime.getTime(),
    }
  })

  return withTimes.sort(byTime)
}

const runOneSpec = (spec) => {
  return cypress.run({
    config: {
      video: false,
    },
    spec: spec.filename,
  })
}

globby('./cypress/integration/*-spec.js')
.then(sortByLastModified)
.then((specs) => {
  console.table('Running last modified spec first', specs)

  return Promise.mapSeries(specs, runOneSpec)
})
.then((runsResults) => {
  // information about each test run is available
  // see the full NPM API declaration in
  // https://github.com/cypress-io/cypress/tree/develop/cli/types

  // you can generate your own report,
  // email or post a Slack message
  // rerun the failing specs, etc.

  // for now show just the summary
  // by drilling down into specResults objects
  const summary = runsResults
  .map((oneRun) => oneRun.runs[0])
  .map((run) => {
    return {
      spec: run.spec.name,
      tests: run.stats.tests,
      passes: run.stats.passes,
      failures: run.stats.failures,
    }
  })

  console.table('Test run summary', summary)
})
