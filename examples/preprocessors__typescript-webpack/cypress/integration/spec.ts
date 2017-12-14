import { add } from '../support/add'

// brings type definition from @types/chai
declare const expect: Chai.ExpectStatic

describe('TypeScript', () => {
  it('works', () => {
    // note TypeScript definition
    const x: number = 42
  })

  it('checks shape of an object', () => {
    const object = {
      age: 21,
      name: 'Joe',
    }
    expect(object).to.have.all.keys('name', 'age')
  })

  it('uses cy commands', () => {
    cy.wrap({}).should('deep.eq', {})
  })

  it('tests our example site', () => {
    cy.visit('https://example.cypress.io/')
    cy.get('.home-list').contains('Querying').click()
    cy.get('#query-btn').should('contain', 'Button')
  })

  // enable once we release updated TypeScript definitions
  it('has Cypress object type definition', () => {
    expect(Cypress.version).to.be.a('string')
  })

  // wrong code on purpose to type check our definitions
  // it('can visit website', () => {
  //   cy.boo()
  // })

  it('adds numbers', () => {
    expect(add(2, 3)).to.equal(5)
  })
})
