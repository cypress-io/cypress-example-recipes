/* eslint-disable no-console */
const cypress = require('cypress')
// http://riaevangelist.github.io/node-ipc/
const ipc = require('node-ipc')

// This process runs first using "node ." command.
// It creates an IPC server with ID "cypressListener"
// and then starts Cypress tests using "cypress" NPM module API
// (see https://on.cypress.io/module-api)
ipc.config.id = 'cypressListener'
ipc.serve(() => {
  console.log('ipc.serve')

  cypress.run().then((results) => {
    console.log('all done ✔️')
    ipc.server.stop()
  }, (err) => {
    console.error(err.message)
    process.exit(1)
  })

  // receive stream of events
  // we will get a message with each test's results
  // as soon as the test runs
  // (in reality, it will be send when the next test starts,
  // or for the last test when "after" hook starts)
  ipc.server.on('test:after:run', (data) => {
    console.log('test finsihed: "%s" %s %dms',
      data.title, data.state, data.duration)
  })
})

ipc.server.start()
