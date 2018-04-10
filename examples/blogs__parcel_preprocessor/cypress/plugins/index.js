const ParcelBundler = require('parcel-bundler')
const path = require('path')

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
    outDir
  }
  const bundler = new ParcelBundler(filePath, options)
  return bundler.bundle()
}

const bundlers = {}

const onFile = (file) => {
  const { filePath, shouldWatch, outputPath } = file
  if (!shouldWatch) {
    console.log('bundle file once without watching to %s', outputPath)
    return bundleOnce(filePath, outputPath).then(_ => outputPath)
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
    hmr: false
  }

  const bundler = new ParcelBundler(filePath, options)

  bundlers[filePath] = new Promise((resolve, reject) => {
    bundler.on('bundled', b => {
      console.log('bundled %s', filePath)
      console.log('into %s', b.name)
      file.emit('rerun')
      resolve(b.name)
    })
    bundler.bundle().catch(reject)
  })

  file.on('close', () => {
    console.log('closing', filePath)
    console.log(bundler)
    delete bundlers[filePath]
  })

  return bundlers[filePath]
}

module.exports = (on, config) => {
  on('file:preprocessor', onFile)
}
