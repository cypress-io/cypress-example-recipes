/* eslint-disable no-console */

const _ = require('lodash')
const fse = require('fs-extra')
const path = require('path')
const execa = require('execa')
const Promise = require('bluebird')

const glob = Promise.promisify(require('glob'))

// grab all the npm start scripts from
// each package.json
glob(path.join('examples', '*', 'package.json'), {
  realpath: true,
})
.map((pathToPackage) => {
  return fse.readJson(pathToPackage)
  .then((pkgJson) => {
    const start = _.get(pkgJson, ['scripts', 'start'])

    if (start) {
      console.log('Running \'npm start\' in', pkgJson.name)

      execa.shell(start, {
        stdio: 'inherit',
        cwd: path.dirname(pathToPackage),
      })
    }
  })
})
.then(() => {
  console.log('\nDone booting all servers. Ready to run Cypress.')
})
