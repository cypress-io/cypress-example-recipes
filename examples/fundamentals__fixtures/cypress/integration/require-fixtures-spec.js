/// <reference types="cypress" />
// because JSON files can be bundled by default
// the most common use case for fixtures - JSON data - can be simply
// which is "loaded" once
const city = require('../fixtures/city.json')
const country = require('../fixtures/country.json')

// bundled "os" module does not have the right EOL
// thus we need to set it based on the platform ourself
const EOL = Cypress.platform === 'win32' ? '\\' : '/'

/**
 * Joins parts of the file path using the EOL
 * @example
 *  join('cypress', 'integration')
 *    // "cypress/integration" on non-Windows
 *    // "cypress\integration" on Windows
*/
const join = (...paths) => paths.join(EOL)

describe('requires fixtures', () => {
  it('has city', () => {
    expect(city).to.deep.equal({ name: 'Atlanta' })
  })

  it('has country', () => {
    expect(country).to.deep.equal({ name: 'United States' })
  })

  context('sanity JavaScript tests', () => {
    // confirm that the spec information is present

    it('has __dirname', () => {
      expect(__dirname).to.be.a('string')
      // on Windows OS the directory is "cypress\integration"
      // on other operating systems it is "cypress/integration"
      expect(__dirname).to.equal(join('cypress', 'integration'))
    })

    it('has __filename', () => {
      expect(__filename).to.be.a('string')
      expect(__filename).to.equal(
        join('cypress', 'integration', 'require-fixtures-spec.js')
      )
    })
  })
})
