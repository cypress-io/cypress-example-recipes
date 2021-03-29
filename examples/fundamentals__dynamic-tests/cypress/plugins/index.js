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
const got = require('got')
const _ = require('lodash')

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = async (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  on('task', {
    getData () {
      return ['a', 'b', 'c']
    },
  })

  // you can fetch the dynamic list to use to generate the data
  // before any tests run (even before the browser opens)
  const { body } = await got('https://jsonplaceholder.cypress.io/users?_limit=5', {
    responseType: 'json',
  })

  // pass the data through the Cypress config object
  // by storing it in the environment object.
  // we are only interested in a few properties in each user object
  config.env.users = _.map(body, (user) => _.pick(user, 'id', 'name', 'email'))
  console.table(config.env.users)

  // IMPORTANT: return the updated config object
  return config
}
