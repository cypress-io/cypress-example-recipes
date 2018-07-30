/* eslint-disable no-console */

const _ = require('lodash')
const path = require('path')
const debug = require('debug')('cypress-example-recipes')
const assert = require('assert')
const cypress = require('cypress')
const Promise = require('bluebird')
const minimist = require('minimist')
const prettyMs = require('pretty-ms')

const assertIsFinite = (value, name) => {
  return assert(_.isFinite(value), `expected '${name}' to be a finite number. got '${value}' instead.`)
}

// parse the args passed into this process
const args = minimist(process.argv.slice(2), {
  string: ['example'],
  boolean: ['record'],
  default: {
    example: '*',
  },
  alias: {
    groupId: 'group-id',
  },
})

const glob = Promise.promisify(require('glob'))

const started = Date.now()
let numFailed = 0

// grab all the npm start scripts from
// each package.json
const mask = args.example
glob(path.join('examples', mask), {
  realpath: true,
})
.each((pathToExampleProject) => {
  console.log('Running example project:', pathToExampleProject)

  return cypress
  .run({
    project: pathToExampleProject,
    browser: args.browser,
    record: args.record,
  })
  .then((results = {}) => {
    debug('results were: %o', results)

    assertIsFinite(results.totalFailed, 'results.totalFailed')

    numFailed += results.totalFailed

    debug('total numFailed is: %o', numFailed)
  })
})
.then(() => {
  const duration = Date.now() - started

  console.log('\n--All Done--\n')
  console.log('Total duration:', prettyMs(duration)) // format this however you like
  console.log('Exiting with final code:', numFailed)

  // make sure this is a finite number and not NaN
  assertIsFinite(numFailed, 'numFailed')

  process.exit(numFailed)
})
.catch((err) => {
  console.error(err)
  throw err
})
