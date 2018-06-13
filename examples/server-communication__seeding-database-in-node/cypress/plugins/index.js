// This enables using import/export in plugins/main.js
// and any files it requires
//
// Support for other syntax and features (not supported
// by the version of node run by Cypress) can
// be configured via babel plugins in the .babelrc

require('babel-register')

module.exports = require('./main').default
