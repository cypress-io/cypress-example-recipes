// runs Cypress end-to-end tests using Cypress NPM module API
// https://on.cypress.io/module-api

const cypress = require('cypress')
const globby = require('globby')
const Promise = require('bluebird')
const fs = require('fs')
require('console.table')

const byTime = (a, b) => a.time - b.time

const sortByLastModified = (filenames) => {
  const withTimes = filenames.map(filename => ({
    filename,
    time: fs.statSync(filename).mtime.getTime()
  }))
  return withTimes.sort(byTime)
}

const runOneSpec = (spec) =>
  cypress
    .run({
      config: {
        video: false
      },
      spec: spec.filename
    })

globby('./cypress/integration/*-spec.js')
  .then(sortByLastModified)
  .then(specs => {
    console.table('Running specs in order', specs)
    return Promise.mapSeries(specs, runOneSpec)
  })

