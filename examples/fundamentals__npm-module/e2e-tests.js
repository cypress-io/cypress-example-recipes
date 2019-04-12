// runs Cypress end-to-end tests using Cypress NPM module APO
// https://on.cypress.io/module-api
const cypress = require('cypress')
const globby = require('globby')
const Promise = require('bluebird')

globby('./cypress/integration/*-spec.js').then(specs => {
  console.log(specs)
  return Promise.mapSeries(specs, runOneSpec)
})

const runOneSpec = (spec) =>
  cypress
    .run({
      config: {
        video: false
      },
      spec
    })



