/// <reference types="cypress" />
/* eslint-disable no-console */
const AdmZip = require('adm-zip')
const { stripIndent } = require('common-tags')
const globby = require('globby')
const { rmdir } = require('fs')

const { readExcelFile } = require('./read-excel')
const { readPdf } = require('./read-pdf')

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // register utility tasks to read and parse Excel files
  on('task', {
    readExcelFile,

    readPdf,

    validateZipFile (filename) {
      // now let's validate the downloaded ZIP file
      // the validations depend on your projects. For this example
      // we will check that the zip has two entries "a.txt" and "b.txt"
      // and that the contents of the zipped file "a.txt" are the same as expected

      // Tip: use https://github.com/cthackers/adm-zip to load and unzip the Zip contents
      console.log('loading zip', filename)
      const zip = new AdmZip(filename)
      const zipEntries = zip.getEntries()

      const names = zipEntries.map((entry) => entry.entryName).sort()

      console.log('zip file %s has entries %o', filename, names)

      // since this is plugins code we do not have built-in "expect" or "assert" functions
      // instead we can throw an Error object which fails the "cy.task" command
      if (names.length !== 2) {
        throw new Error(`List of files ${names.join(',')} in ${filename} has extra files`)
      }

      // if there is no error, let's print positive message to the terminal
      // to let the user know this validation was successful
      console.log('✅ number of entries')

      if (!names.includes('a.txt')) {
        throw new Error(`List of files ${names.join(',')} in ${filename} is missing a.txt`)
      }

      console.log('✅ has a.txt entry')

      if (!names.includes('b.txt')) {
        throw new Error(`List of files ${names.join(',')} in ${filename} is missing b.txt`)
      }

      console.log('✅ has b.txt entry')

      // confirm the contents of an entry inside the Zip file
      // the entry is just a text file in our case
      // let's grab its text content and compare to the expected string
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

    // a task to find one file matching the given mask
    // returns just the first matching file
    async findFiles (mask) {
      if (!mask) {
        throw new Error('Missing a file mask to search')
      }

      console.log('searching for files %s', mask)

      const list = await globby(mask)

      if (!list.length) {
        console.log('found no files')

        return null
      }

      console.log('found %d files, first one %s', list.length, list[0])

      return list[0]
    },

    deleteFolder (folderName) {
      console.log('deleting folder %s', folderName)

      return new Promise((resolve, reject) => {
        rmdir(folderName, { maxRetries: 10, recursive: true }, (err) => {
          if (err && err.code !== 'ENOENT') {
            console.error(err)

            return reject(err)
          }

          resolve(null)
        })
      })
    },
  })
}
