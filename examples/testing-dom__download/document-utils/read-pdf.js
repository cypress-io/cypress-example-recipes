/* eslint-disable no-console */

const fs = require('fs')
const pdf = require('pdf-parse')

const readPdf = (filename) => {
  console.log('reading PDF file %s', filename)

  const dataBuffer = fs.readFileSync(filename)

  return pdf(dataBuffer).then(function (data) {
    return {
      numpages: data.numpages,
      text: data.text,
    }
  })
}

module.exports = { readPdf }

if (!module.parent) {
  const filename = './public/why-cypress.pdf'

  readPdf(filename).then(console.log)
}
