/// <reference types="cypress" />
const allUsers = require('../fixtures/users.json')
// you can even require another JavaScript file
// and use whatever was exported there
const { names } = require('../fixtures/names')

// sanity check
expect(names, 'list of names').to.be.an('array')

describe('array fixture', () => {
  it('iterates over a list', () => {
    cy.fixture('users').then((users) => {
      expect(users).to.be.an('array').and.to.have.have.length(3)

      users.forEach((user) => {
        expect(user).to.have.keys(['name', 'age'])
        expect(user.age).to.be.a('number').and.be.gt(10).and.be.lt(100)
      })
    })
  })

  // we can dynamically create tests from a static JSON list
  // that we have loaded using "require" or "import" statement
  // for more examples, see "Dynamic tests" recipes
  allUsers.forEach((user) => {
    it(`has user ${user.name}`, () => {
      cy.wrap(user).should('have.property', 'name', user.name)
      cy.wrap(user).should('have.property', 'age', user.age)
    })
  })

  context('imported names', () => {
    // create a test for each name
    names.forEach((name) => {
      it(`"${name}" has first and last name`, () => {
        expect(name).to.match(/^\w+ \w+$/)
      })
    })
  })
})
