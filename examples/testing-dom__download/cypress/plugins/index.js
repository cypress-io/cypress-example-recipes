/// <reference types="cypress" />
/* eslint-disable no-console */
const path = require('path')
const fs = require('fs')
const readXlsxFile = require('read-excel-file/node')
const AdmZip = require('adm-zip')
const { stripIndent } = require('common-tags')

// place downloads into "cypress/downloads" folder
const downloadDirectory = path.join(__dirname, '..', 'downloads')

const isFirefox = (browser) => browser.family === 'firefox'

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // register utility tasks to clear the downloads folder,
  // read and parse Excel files
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

    validateZipFile (filename) {
      // use https://github.com/cthackers/adm-zip to validate the ZIP file
      console.log('loading zip', filename)
      const zip = new AdmZip(filename)
      const zipEntries = zip.getEntries()

      const names = zipEntries.map((entry) => entry.entryName).sort()

      console.log('zip file %s has entries %o', filename, names)

      if (names.length !== 2) {
        throw new Error(`List of files ${names.join(',')} in ${filename} has extra files`)
      }

      console.log('✅ number of entries')

      if (!names.includes('a.txt')) {
        throw new Error(`List of files ${names.join(',')} in ${filename} is missing a.txt`)
      }

      console.log('✅ has a.txt entry')

      if (!names.includes('b.txt')) {
        throw new Error(`List of files ${names.join(',')} in ${filename} is missing b.txt`)
      }

      console.log('✅ has b.txt entry')

      // confirm the contents of an entry, which is just a text file
      const aEntry = zip.readAsText('a.txt').trim()
      const expectedText = stripIndent`
      hello zip
      and Cypress recipes
      `

      if (aEntry !== expectedText) {
        console.error('Expected file a.txt to have text')
        console.error('------')
        console.error(expectedText)
        console.error('------')
        console.error('but it had text')
        console.error('------')
        console.error(aEntry)
        console.error('------')
        throw new Error(stripIndent`
          Invalid a.txt entry in the zip file ${filename}
          See terminal for more details
        `)
      }

      console.log('✅ a.txt file has the expected contents')

      // any other validations?

      return null
    },
  })

  // https://on.cypress.io/browser-launch-api
  on('before:browser:launch', (browser, options) => {
    console.log('browser %o', browser)

    if (isFirefox(browser)) {
      options.preferences['browser.download.dir'] = downloadDirectory
      options.preferences['browser.download.folderList'] = 2

      // needed to prevent download prompt for text/csv and Excel files
      // grab the Excel MIME types by downloading the files in Excel and observing
      // the reported MIME content types in the Developer Toos
      options.preferences['browser.helperApps.neverAsk.saveToDisk'] =
        'text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

      return options
    }

    // note: we set the download folder in Chrome-based browsers
    // from the spec itself using automation API
  })
}
