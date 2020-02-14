/* eslint-disable no-console */
const os = require('os')
const execa = require('execa')
const tasks = require('./tasks')

/**
 * Parses STDOUT from "brave-browser --version" command.
 * @param {string} stdout from Brave, something like "Brave Browser 77.0.69.135"
 */
const parseBraveVersion = (stdout) => {
  const [, version] = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(stdout)

  console.log('Brave browser version is', version)
  const majorVersion = parseFloat(version.split('.')[0])

  return { version, majorVersion }
}

const findBraveBrowserInfo = (browserPath) => {
  return execa(browserPath, ['--version'])
  .then((result) => result.stdout)
  .then(parseBraveVersion)
  .then(({ version, majorVersion }) => {
    return {
      name: 'brave',
      channel: 'stable',
      family: 'chromium',
      displayName: 'Brave',
      version,
      path: browserPath,
      majorVersion,
    }
  })
}

const findBraveBrowser = () => {
  // the path is hard-coded for simplicity
  switch (os.platform()) {
    case 'darwin':
      return findBraveBrowserInfo(
        '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'
      )
    case 'linux':
      return findBraveBrowserInfo('brave-browser')
    default:
      throw new Error(`Cannot find Brave browser on platform ${os.platform()}`)
  }
}

module.exports = (on, config) => {
  on('task', tasks)

  // only filter browsers if we are passed a list - this way
  // this example works on Cypress v3.7.0+ and below
  if (!config.browsers) {
    return
  }

  // kind of hack - we don't know the Cypress version running
  // so we need to look at known Electron browser
  const electron = config.browsers.find((browser) => browser.name === 'electron')

  if (!electron) {
    console.error('Could not find even Electron browser ⚠️')

    return
  }

  // Cypress v3.7.0+
  return findBraveBrowser().then((browser) => {
    browser.family = electron.family

    return {
      browsers: [browser],
    }
  })
}
