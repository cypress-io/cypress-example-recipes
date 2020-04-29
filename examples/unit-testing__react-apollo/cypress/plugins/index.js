module.exports = (on, config) => {
  // tell Cypress to bundle specs and components using project's .babelrc file
  require('cypress-react-unit-test/plugins/cra-v3')(on, config)

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config
}
