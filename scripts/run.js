const _ = require('lodash')
const path = require('path')
const cypress = require('cypress')
const Promise = require('bluebird')
const minimist = require('minimist')
const prettyMs = require('pretty-ms')

// get the args passed into this process
const args = minimist(process.argv.slice(2))

const glob = Promise.promisify(require('glob'))

const started = new Date()
let numFailed = 0

// grab all the npm start scripts from
// each package.json
glob(path.join('examples', '*'), {
  realpath: true
})
.each((pathToExampleProject) => {
  console.log('Running example project:', pathToExampleProject)

  return cypress.run({
    project: pathToExampleProject,
    browser: args.browser
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
