// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  // we can grab some process environment variables
  // and stick it into config.env before returning the updated config
  config.env = config.env || {}
  // you could extract only specific variables
  // and rename them if necessary
  config.env.FOO = process.env.FOO
  config.env.BAR = process.env.BAR
  console.log('extended config.env with process.env.{FOO, BAR}')
  return config
}
