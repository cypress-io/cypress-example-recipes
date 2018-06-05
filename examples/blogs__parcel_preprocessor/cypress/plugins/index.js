const ParcelBundler = require('parcel-bundler')
const path = require('path')

/* global Promise */
/* eslint-disable no-console */

const bundleOnce = (filePath, outputPath) => {
  const outDir = path.dirname(outputPath)
  const outFile = path.basename(outputPath)

  // seems parcel-bundler 1.7.0 does not want extension
  // in the output filename
  const basename = path.basename(outFile, '.js')
  const options = {
    watch: false,
    hmr: false,
    outFile: basename,
    outDir,
  }
  const bundler = new ParcelBundler(filePath, options)
  return bundler.bundle()
}

const bundlers = {}

const onFile = (file) => {
  const { filePath, shouldWatch, outputPath } = file
  if (!shouldWatch) {
    console.log('bundle file once without watching to %s', outputPath)
    return bundleOnce(filePath, outputPath).then(() => outputPath)
  }

  if (bundlers[filePath]) {
    return bundlers[filePath]
  }

  console.log('watch and bundle file %s', outputPath)

  // instead of temp folder for output files, use default "dist" folder
  // this way the source maps are created and served next to the bundle

  const options = {
    watch: shouldWatch,
    // make output simpler and avoid possible conflicts with Cypress
    // by NOT having hot module reloading
    hmr: false,
  }

  const bundler = new ParcelBundler(filePath, options)

  bundlers[filePath] = new Promise((resolve, reject) => {
    bundler.bundle()
    .then((r) => {
      if (r) {
        console.log('finished bundle', r.name)
        resolve(r.name)
      } else {
        reject(new Error(`Could not bundle ${filePath}`))
      }
    })
    .catch(reject)
  })

  bundler.on('bundled', (b) => {
    console.log('bundled %s', filePath)
    console.log('into %s', b.name)

    // overwrite the cached promise
    bundlers[filePath] = new Promise((resolve) => {
      file.emit('rerun')
      resolve(b.name)
    })
  })

  file.on('close', () => {
    console.log('closing', filePath)
    console.log(bundler)
    delete bundlers[filePath]
  })

  return bundlers[filePath]
}

// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  on('file:preprocessor', onFile)
}
