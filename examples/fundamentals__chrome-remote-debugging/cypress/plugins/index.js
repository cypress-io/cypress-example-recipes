const CDP = require('chrome-remote-interface');

function ensureRdpPort(args) {
    const existing = args.find(arg => arg.slice(0, 23) === '--remote-debugging-port')

    if (existing) {
        return Number(existing.split('=')[1])
    }

    const port = 40000 + Math.round(Math.random() * 25000)

    args.push(`--remote-debugging-port=${port}`)

    return port
}

let port = 0;

module.exports = (on, config) => {
    on('before:browser:launch', (browser, args) => {
        port = ensureRdpPort(args);
    })
    on("task", {
        activatePrintMediaQuery: async () => {
            const client = await CDP({ port });
            return client.send('Emulation.setEmulatedMedia', { media: "print" })
        },
        activateHoverPseudo: async ({ selector }) => {
            const client = await CDP({ port });
            await client.DOM.enable();
            await client.CSS.enable();
            // as the Window consists of two IFrames, we must retrive the right one
            const allRootNodes = await client.DOM.getFlattenedDocument();
            const filtered = allRootNodes.nodes.filter(node => node.nodeName == "IFRAME" && node.contentDocument);
            // The first IFrame is our App
            const root = filtered[0].contentDocument;
            const { nodeId } = await client.DOM.querySelector({
                nodeId: root.nodeId,
                selector
            });
            return client.CSS.forcePseudoState({
                nodeId,
                forcedPseudoClasses: ['hover']
            });
        }
    })
}