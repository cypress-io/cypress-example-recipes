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
})
