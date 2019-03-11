/// <reference types="cypress" />
describe('Dynamic tests', () => {
  context('generated from a list', () => {
    const operations = [
      {
        op: '2 + 2',
        value: 4,
      },
      {
        op: '10 - 15',
        value: -5,
      },
      {
        op: '3 * 17',
        value: 51,
      },
    ]

    // dynamically create a single test for each operation in the list
    operations.forEach((operation) => {
      // derive test name from data
      it(`computes ${operation.op} = ${operation.value}`, () => {
        cy.wrap(eval(operation.op)).should('equal', operation.value)
      })
    })
  })

  context('generated from fixture', () => {
    // we cannot load JSON file using "cy.fixture"
    // because it means the test is already running
    // so we need to load JSON file using "require"
    const colors = require('../fixtures/colors')
    const rainbow = ['red', 'orange', 'yellow', 'green', 'blue', 'violet']
    colors.forEach((color) => {
      it(`has color ${color}`, () => {
        cy.wrap(color).should('be.oneOf', rainbow)
      })
    })
  })

  context('dynamic users', () => {
    before(() => {
      // receive the dynamic list of users
      cy.request('https://jsonplaceholder.cypress.io/users?limit=3')
      .its('body')
      .should('have.length', 10)
      .invoke('slice', 0, 3)
      .as('users')
      // the above lines "invoke" + "as" are equivalent to
      // .then((list) => {
      //   this.users = list.slice(0, 3)
      // })
    })

    describe('fetched users', () => {
      // we know there will be 3 objects in the "users" list
      Cypress._.range(0, 3).forEach((k) => {
        it(`# ${k}`, function () {
          // we need to use "function () {}" callback for "it"
          // to make sure "this" points at the test context
          const user = this.users[k]
          cy.log(`user ${user.name} ${user.email}`)
          cy.wrap(user).should('have.property', 'name')
        })
      })
    })
  })
})
