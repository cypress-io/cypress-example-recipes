/* eslint-disable no-console */
const got = require('got')
// Cypress tests in the 'integration' folder have access to
// the Cypress object and the bundled Cypress._ Lodash
// The plugin file does NOT have Cypress object
// and thus has to import any 3rd party libraries
const _ = require('lodash')

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
module.exports = async (on, config) => {
  // when we load the plugins file, let's fetch the list of users
  const users = await got('https://jsonplaceholder.cypress.io/users?_limit=3').json()

  // we are only interested in the username and ID fields
  const userInfo = _.map(users,
    (user) => _.pick(user, ['id', 'username', 'email']))

  console.log('Fetched the following users for testing')
  console.table(userInfo)

  // then set it inside the config object under the environment
  // which will make it available via Cypress.env("users")
  // before the start of the tests
  config.env.users = userInfo

  return config
}
