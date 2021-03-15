// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

/* eslint-disable no-console */

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const fs = require('fs')
const path = require('path')
const neatCSV = require('neat-csv')

module.exports = async (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  // when we load the plugins file, let's load the CSV file
  const filename = path.join(__dirname, 'users.csv')

  console.log('loading file', filename)
  const text = fs.readFileSync(filename, 'utf8')
  const csv = await neatCSV(text)

  console.log('loaded the users')
  console.log(csv)

  // then set it inside the config object under the environment
  // which will make it available via Cypress.env("usersList")
  // before the start of the tests
  config.env.usersList = csv

  return config
}
