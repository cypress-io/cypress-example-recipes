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

const onFile = ({ filePath, shouldWatch, outputPath }) => {
  if (!shouldWatch) {
    console.log('bundle file once without watching to %s', outputPath)
    return bundleOnce(filePath, outputPath).then(_ => outputPath)
  }
}

module.exports = (on, config) => {
  on('file:preprocessor', onFile)
}
