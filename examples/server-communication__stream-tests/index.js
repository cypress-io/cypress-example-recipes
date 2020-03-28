/* eslint-disable no-console */
const cypress = require('cypress')
// http://riaevangelist.github.io/node-ipc/
const ipc = require('node-ipc')

ipc.config.id = 'cypressListener'
ipc.serve(() => {
  console.log('ipc.serve')

  cypress.run().then((results) => {
    console.log('all done ✔️')
    // console.log('%o', results)
    ipc.server.stop()
  }, (err) => {
    console.error(err.message)
    process.exit(1)
  })

  ipc.server.on('message', (data) => {
    ipc.log('got a message'.deba, data)
  })
})

ipc.server.start()
