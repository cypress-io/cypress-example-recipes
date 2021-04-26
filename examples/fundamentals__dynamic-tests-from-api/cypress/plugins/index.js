/* eslint-disable no-console */
const got = require('got')

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
module.exports = async (on, config) => {
  // when we load the plugins file, let's fetch the list of users
  const users = await got('https://jsonplaceholder.cypress.io/users?_limit=5').json()
  console.log(users)

  // then set it inside the config object under the environment
  // which will make it available via Cypress.env("usersList")
  // before the start of the tests
  config.env.usersList = users

  return config
}
