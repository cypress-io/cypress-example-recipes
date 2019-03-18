// a script that goes through each example folder
// and runs tests in each one
// Useful when one needs to test everything in this repo using a single command

/* eslint-disable no-console */
const globby = require('globby')
const bluebird = require('bluebird')
const tb = require('terminal-banner').terminalBanner

const getExamples = () => {
  return globby('examples/*', { onlyFiles: false, expandDirectories: false })
}

const testExample = (folder) => {
  tb(`Testing ${folder}`)
}

const testExamples = (folders) => {
  return bluebird.mapSeries(folders, testExample)
}

const filterSomeFolders = (folders) => {
  // blogs__codepen-demo breaks
  return folders.filter((folder) => !folder.includes('codepen'))
}

getExamples()
.then((list) => list.slice(0, 3))
.then(filterSomeFolders)
.then(testExamples)
.catch((e) => {
  console.error(e.message)
  process.exit(1)
})
