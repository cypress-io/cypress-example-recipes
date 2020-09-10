/// <reference types="cypress" />
/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')

// place downloads into "cypress/downloads" folder
const downloadDirectory = path.join(__dirname, '..', 'downloads')

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // register utility task to clear the downloads folder
  on('task', {
    clearDownloads: () => {
      console.log('clearing folder %s', downloadDirectory)

      fs.rmdirSync(downloadDirectory, { recursive: true })

      return null
    },
  })

  // https://on.cypress.io/browser-launch-api
  on('before:browser:launch', (browser, options) => {
    console.log('browser %o', browser)

    if (browser.family === 'chromium' && browser.name !== 'electron') {
      options.preferences.default['download'] = { default_directory: downloadDirectory }

      return options
    }

    if (browser.family === 'firefox') {
      options.preferences['browser.download.dir'] = downloadDirectory
      options.preferences['browser.download.folderList'] = 2

      // needed to prevent download prompt for text/csv files.
      options.preferences['browser.helperApps.neverAsk.saveToDisk'] = 'text/csv'

      return options
    }
  })

  // TODO: filter out Electron browser since it is not supported yet
}
