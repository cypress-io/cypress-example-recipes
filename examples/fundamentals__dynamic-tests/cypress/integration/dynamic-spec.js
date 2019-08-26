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
    // this example fetches list of 3 users from the server
    // and then creates 3 separate tests to check something about each user

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

  context('generated using cy.task', () => {
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

  context('generated using cy.task and saved in closure', () => {
    // instead of using test context "this" to save fetched list
    // use closure variable to save it and never worry about
    // "this" and "() => {...}" vs "function () {...}" syntax
    let letters

    before(() => {
      cy.task('getData').then((list) => {
        letters = list
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
