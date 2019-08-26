/// <reference types="cypress" />
// because JSON files can be bundled by default
// the most common use case for fixtures - JSON data - can be simply
// which is "loaded" once
const city = require('../fixtures/city.json')
const country = require('../fixtures/country.json')

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
      expect(__dirname).to.equal('/cypress/integration')
    })

    it('has __filename', () => {
      expect(__filename).to.be.a('string')
      expect(__filename).to.equal(
        '/cypress/integration/require-fixtures-spec.js'
      )
    })
  })
})
