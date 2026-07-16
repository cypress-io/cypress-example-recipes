const { defineConfig } = require('cypress')

const CDP = require('chrome-remote-interface')
const debug = require('debug')('cypress:server:protocol')

function ensureRdpPort (args) {
  const existing = args.find(
    (arg) => arg.slice(0, 23) === '--remote-debugging-port'
  )

  if (existing) {
    return Number(existing.split('=')[1])
  }

  const port = 40000 + Math.round(Math.random() * 25000)

  args.push(`--remote-debugging-port=${port}`)

  return port
}

let port = 0
let client = null

module.exports = defineConfig({
  fixturesFolder: false,
  e2e: {
    supportFile: false,
    setupNodeEvents (on, config) {
      on('before:browser:launch', (browser, launchOptionsOrArgs) => {
        debug('browser launch args or options %o', launchOptionsOrArgs)
        const args = Array.isArray(launchOptionsOrArgs)
          ? launchOptionsOrArgs
          : launchOptionsOrArgs.args

        port = ensureRdpPort(args)
        debug('ensureRdpPort %d', port)
        debug('Chrome arguments %o', args)
      })

      on('task', {
        resetCRI: async () => {
          if (client) {
            debug('resetting CRI client')
            await client.close()
            client = null
          }

          return Promise.resolve(true)
        },
        activatePrintMediaQuery: async () => {
          debug('activatePrintMediaQuery')

          client =
            client ||
            (await CDP({
              port,
            }))

          return client.send('Emulation.setEmulatedMedia', {
            media: 'print',
          })
        },
        activateHoverPseudo: async ({ selector }) => {
          debug('activateHoverPseudo')

          client =
            client ||
            (await CDP({
              port,
            }))

          await client.DOM.enable()
          await client.CSS.enable()

          // The window contains multiple same-origin iframes (e.g. the reporter
          // frame and the app frame), so find the one that actually holds the
          // element rather than assuming a fixed position.
          const allRootNodes = await client.DOM.getFlattenedDocument()

          const isIframe = (node) => {
            return node.nodeName === 'IFRAME' && node.contentDocument
          }

          const frames = allRootNodes.nodes.filter(isIframe)

          let nodeId

          for (const frame of frames) {
            const { nodeId: found } = await client.DOM.querySelector({
              nodeId: frame.contentDocument.nodeId,
              selector,
            })

            if (found) {
              nodeId = found
              break
            }
          }

          if (!nodeId) {
            throw new Error(`Could not find an iframe containing selector: ${selector}`)
          }

          return client.CSS.forcePseudoState({
            nodeId,
            forcedPseudoClasses: ['hover'],
          })
        },
      })
    },
  },
})
