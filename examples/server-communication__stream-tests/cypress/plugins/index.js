/// <reference types="cypress" />
/* eslint-disable no-console */

// http://riaevangelist.github.io/node-ipc/
const ipc = require('node-ipc')

ipc.connectTo('cypressListener', () => {
  ipc.of.cypressListener.on('connect', () => {
    ipc.log('## connected to Cypress listener ##')
  })
})

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  on('task', {
    testFinished (attributes) {
      // console.log(name)
      console.log('%s: "%s" %dms', attributes.state, attributes.title, attributes.duration)
      ipc.of.cypressListener.emit('test:after:run', {
        state: attributes.state,
        title: attributes.title,
        duration: attributes.duration,
      })

      return null
    },
  })
}
