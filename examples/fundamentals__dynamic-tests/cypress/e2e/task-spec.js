/// <reference types="cypress" />
describe('Dynamic tests with cy.task', () => {
  context('using an alias', () => {
    before(() => {
      cy.task('getData').as('letters')
    })

    describe('dynamic letters', () => {
      it('has fetched letters', function () {
        // note that to access test context "this" we need
        // to use "function () {...}" callback form for the test
        expect(this.letters).to.be.an('array')
      })

      // We cannot access "this.letters" yet, it will only
      // be set once the tests are ready to run
      // so we need to somehow decide how many tests to generate
      // For example, we know that there should be 3 letters in the returned list
      Cypress._.range(0, 3).forEach((k) => {
        it(`tests letter #${k}`, function () {
          const letter = this.letters[k]

          cy.wrap(letter).should('match', /a|b|c/)
        })
      })
    })
  })

  context('saved in closure', () => {
    // instead of using test context "this" to save fetched list
    // use closure variable to save it and never worry about
    // "this" and "() => {...}" vs "function () {...}" syntax
    let letters

    before(() => {
      cy.task('getData').then((list) => {
        letters = list
        // assert that we only have 3 items in the list
        // because we are generating 3 tests below
        expect(list).to.have.length(3)
      })
    })

    describe('fetched letters', () => {
      Cypress._.range(0, 3).forEach((k) => {
        it(`tests letter #${k}`, () => {
          const letter = letters[k]

          cy.wrap(letter).should('match', /a|b|c/)
        })
      })
    })
  })
})
