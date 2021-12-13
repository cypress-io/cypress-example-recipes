/// <reference types="cypress" />
describe('Loading multiple fixtures', () => {
  context('before each test using closure variables', () => {
    let city
    let country

    beforeEach(() => {
      cy.fixture('city').then((c) => {
        city = c
      })

      cy.fixture('country').then((c) => {
        country = c
      })
    })

    it('has loaded fixtures', () => {
      expect({ city, country }).to.deep.equal({
        city: { name: 'Atlanta' },
        country: { name: 'United States' },
      })
    })

    it('still has fixtures in the second test', () => {
      expect({ city, country }).to.deep.equal({
        city: { name: 'Atlanta' },
        country: { name: 'United States' },
      })
    })
  })

  context('once before all tests', () => {
    let city
    let country

    before(() => {
      // load fixtures once before any tests
      // and they are kept in closure variables
      cy.fixture('city').then((c) => {
        city = c
      })

      cy.fixture('country').then((c) => {
        country = c
      })
    })

    it('has loaded fixtures', () => {
      expect({ city, country }).to.deep.equal({
        city: { name: 'Atlanta' },
        country: { name: 'United States' },
      })
    })

    it('still has loaded fixtures', () => {
      // we have loaded the fixtures and stored them
      // in the two variables and they should remain there
      expect({ city, country }).to.deep.equal({
        city: { name: 'Atlanta' },
        country: { name: 'United States' },
      })
    })
  })

  context('using Mocha context', () => {
    // notice how "beforeEach" callback uses "function"
    // form to make sure Mocha context points correctly at "this"
    beforeEach(function () {
      cy.fixture('city').then((c) => {
        this.city = c
      })

      cy.fixture('country').then((c) => {
        this.country = c
      })
    })

    it('has loaded fixtures', function () {
      // again, the test has to use "function" callback
      // to make sure "this" points at the Mocha context
      expect(this.city).to.deep.equal({ name: 'Atlanta' })
      expect(this.country).to.deep.equal({ name: 'United States' })
    })
  })

  context('using @ as shortcut to the Mocha context', () => {
    beforeEach(() => {
      // we can ask Cypress to save the loaded fixture
      // in the Mocha context using "cy.as" command
      // in this case, the callback can be "function" or "=>" expression
      cy.fixture('city').as('city')
      cy.fixture('country').as('country')
    })

    it('has loaded fixtures', function () {
      // again, the test has to use "function" callback
      // to make sure "this" points at the Mocha context
      expect(this.city).to.deep.equal({ name: 'Atlanta' })
      expect(this.country).to.deep.equal({ name: 'United States' })
    })
  })

  context('loading once and using @', () => {
    let city
    let country

    before(() => {
      // load fixtures just once, need to store in
      // closure variables because Mocha context is cleared
      // before each test
      cy.fixture('city').then((c) => {
        city = c
      })

      cy.fixture('country').then((c) => {
        country = c
      })
    })

    beforeEach(() => {
      // we can put data back into the empty Mocha context before each test
      // by the time this callback executes, "before" hook has finished
      cy.wrap(city).as('city')
      cy.wrap(country).as('country')
    })

    it('has loaded fixtures', function () {
      // again, the test has to use "function" callback
      // to make sure "this" points at the Mocha context
      expect(this.city).to.deep.equal({ name: 'Atlanta' })
      expect(this.country).to.deep.equal({ name: 'United States' })
    })
  })
})
