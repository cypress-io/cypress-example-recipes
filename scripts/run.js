/* eslint-disable no-console */

const path = require('path')
const cypress = require('cypress')
const Promise = require('bluebird')
const minimist = require('minimist')
const prettyMs = require('pretty-ms')

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

const started = new Date()
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
    group: true,
    groupId: args.groupId,
  })
  .then((results = {}) => {
    numFailed += results.failures
  })
})
.then(() => {
  const duration = new Date() - started

  console.log('\n--All Done--\n')
  console.log('Total duration:', prettyMs(duration)) // format this however you like
  console.log('Exiting with final code:', numFailed)

  process.exit(numFailed)
})
.catch((err) => {
  console.error(err)
  throw err
})
