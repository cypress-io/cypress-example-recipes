const CDP = require('chrome-remote-interface/index');

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
        newTab: async () => {
            await CDP.New({ port });
        }
    })
}