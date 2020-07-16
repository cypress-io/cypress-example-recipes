// a script that goes through each example folder
// and runs tests in each one
// Useful when one needs to test everything in this repo using a single command

/* eslint-disable no-console */
const globby = require('globby')
const bluebird = require('bluebird')
const tb = require('terminal-banner').terminalBanner
const execa = require('execa')
const pluralize = require('pluralize')
const { resolve, join } = require('path')
const fs = require('fs')
const arg = require('arg')
const la = require('lazy-ass')
const is = require('check-more-types')
const debug = require('debug')('cypress-example-recipes')

// to run "npm run test:ci:chrome" scripts in each example
// run this script with "--chrome" CLI flag
const args = arg({
  '--chrome': Boolean,
  '--brave': Boolean,
  '--firefox': Boolean,
  '--windows': Boolean,
  '--chunk': Number,
  '--total-chunks': Number,
  // TODO switch from separate --chrome|--brave|--firefox
  // to using "--browser chrome" or "--browser firefox" argument
  '--browser': String,
  '--headless': Boolean,
  '--record': Boolean,
})

// fill default values
args['--chunk'] = args['--chunk'] || 0
args['--total-chunks'] = args['--total-chunks'] || 1
console.log('args', args)

// default NPM script name
let scriptName = 'test:ci'

if (args['--chrome']) {
  if (args['--headless']) {
    scriptName = 'test:ci:chrome:headless'
  } else {
    scriptName = 'test:ci:chrome'
  }
}

if (args['--brave']) {
  scriptName = 'test:ci:brave'
}

if (args['--firefox']) {
  scriptName = 'test:ci:firefox'
}

if (args['--windows']) {
  scriptName = 'test:ci:windows'
}

if (args['--record']) {
  // assuming that every package.json has script with ":record" suffix
  scriptName += ':record'
}

console.log('script name "%s"', scriptName)

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

const debugPrintFolders = (folders) => {
  if (debug.enabled) {
    console.error(
      'Will be running tests in %s',
      pluralize('folder', folders.length, true)
    )
  }

  folders.forEach((name) => console.error(' -', name))
}

const hasPackageScriptName = (folder) => {
  const filename = resolve(join(folder, 'package.json'))

  if (!fs.existsSync(filename)) {
    return false
  }

  const { scripts } = require(filename)

  return scripts && scripts[scriptName]
}

const testExample = (folder) => {
  tb(`Testing ${folder}`)
  // runs the same script command in each folder
  // maybe if there is no script, should skip it?
  const filename = resolve(join(folder, 'package.json'))

  if (!fs.existsSync(filename)) {
    console.log('cannot find file "%s"', filename)
    console.log('skipping...')

    return
  }

  const { scripts } = require(filename)

  if (!scripts || !scripts[scriptName]) {
    console.log('file %s does not have script "%s"', filename, scriptName)
    console.log('skipping...')

    return
  }

  const npmArgs = ['run', scriptName]

  console.log('npm arguments: %s', npmArgs.join(' '))

  const npmOptions = { stdio: 'inherit', cwd: folder }

  return execa('npm', npmArgs, npmOptions)
}

const testExamples = (folders) => {
  return bluebird.mapSeries(folders, testExample)
}

const filterSomeFolders = (folders) => {
  // if you want to filter some folders by name for example
  // we want to skip recipes that have outside service dependencies
  // like Codepen demos
  const skipCodepenFolder = (name) => {
    if (name.includes('codepen')) {
      return false
    }

    return true
  }

  return folders.filter(skipCodepenFolder)
}

const filterByChunk = (chunk, totalChunks) => {
  la(
    is.number(chunk) && chunk >= 0,
    'expected chunk to be a number >= 0',
    chunk
  )

  la(
    is.number(totalChunks) && totalChunks > 0,
    'expected total chunks to be >= 1',
    totalChunks
  )

  la(
    chunk < totalChunks,
    'expected chunk',
    chunk,
    'to be less than total chunks',
    totalChunks
  )

  return function filterFolders (folders) {
    const chunkLength = Math.ceil(folders.length / totalChunks)

    console.log(
      'Total folders %d chunks %d chunk size %d current chunk %d',
      folders.length,
      totalChunks,
      chunkLength,
      chunk
    )

    return folders.slice(chunkLength * chunk, chunkLength * (chunk + 1))
  }
}

/**
 * Leaves only folders that have package.json with desired script name
 */
const filterByScriptName = (folders) => {
  return folders.filter(hasPackageScriptName)
}

bluebird
.try(getExamples)
.then((list) => list.sort())
.then(filterByScriptName)
.then(filterSomeFolders)
.tap(debugPrintFolders)
.then(filterByChunk(args['--chunk'], args['--total-chunks']))
.tap(printFolders)
.then(testExamples)
.catch((e) => {
  console.error(e.message)
  process.exit(1)
})
