/// <reference types="cypress" />
/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')

// place downloads into "cypress/downloads" folder
const downloadDirectory = path.join(__dirname, '..', 'downloads')

const isFirefox = (browser) => browser.family === 'firefox'
// excludes Electron, but includes Chrome and Edge
const isChromium = (browser) => {
  return browser.family === 'chromium' && browser.name !== 'electron'
}

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // register utility task to clear the downloads folder
  on('task', {
    clearDownloads () {
      console.log('clearing folder %s', downloadDirectory)

      fs.rmdirSync(downloadDirectory, { recursive: true })

      return null
    },

    readExcelFile (filename) {
      // we must read the Excel file using Node library
      // and can return the parsed list to the browser
      // for the spec code to validate it
      console.log('reading Excel file %s', filename)
      console.log('from cwd %s', process.cwd())

      return readXlsxFile(filename)
    },
  })

  // https://on.cypress.io/browser-launch-api
  on('before:browser:launch', (browser, options) => {
    console.log('browser %o', browser)

    if (isChromium(browser)) {
      options.preferences.default['download'] = { default_directory: downloadDirectory }

      return options
    }

    if (isFirefox(browser)) {
      options.preferences['browser.download.dir'] = downloadDirectory
      options.preferences['browser.download.folderList'] = 2

      // needed to prevent download prompt for text/csv files.
      options.preferences['browser.helperApps.neverAsk.saveToDisk'] = 'text/csv'

      return options
    }
  })

  // customize list of browsers to exclude Electron, since it
  // does not let us set the download folder to avoid system file save prompt
  // https://on.cypress.io/configuration-api
  // https://github.com/cypress-io/cypress-example-recipes/issues/560

  return {
    browsers: config.browsers.filter((b) => isChromium(b) || isFirefox(b)),
  }
}
