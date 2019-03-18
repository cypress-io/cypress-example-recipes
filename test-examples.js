// a script that goes through each example folder
// and runs tests in each one
// Useful when one needs to test everything in this repo using a single command

/* eslint-disable no-console */
const globby = require('globby')
const bluebird = require('bluebird')
const tb = require('terminal-banner').terminalBanner
const execa = require('execa')
const pluralize = require('pluralize')

const getExamples = () => {
  return globby('examples/*', { onlyFiles: false, expandDirectories: false })
}

const printFolders = (folders) => {
  console.log(
    'Will be running tests in %s',
    pluralize('folder', folders.length, true)
  )
  folders.forEach((name) => console.log(' -', name))
}

const testExample = (folder) => {
  tb(`Testing ${folder}`)
  return execa('npm', ['run', 'test:ci'], { stdio: 'inherit', cwd: folder })
}

const testExamples = (folders) => {
  return bluebird.mapSeries(folders, testExample)
}

const filterSomeFolders = (folders) => {
  // blogs__codepen-demo breaks in headless mode
  return folders.filter((folder) => !folder.includes('codepen'))
}

bluebird
.try(getExamples)
.then((list) => list.slice(0, 7))
.then(filterSomeFolders)
.tap(printFolders)
.then(testExamples)
.catch((e) => {
  console.error(e.message)
  process.exit(1)
})
