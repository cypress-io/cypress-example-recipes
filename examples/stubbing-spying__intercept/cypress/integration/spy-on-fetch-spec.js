/// <reference types="Cypress" />

// https://on.cypress.io/intercept
describe('intercept', () => {
  context('spying', function () {
    beforeEach(function () {
      cy.intercept('/favorite-fruits').as('fetchFruits')
      cy.visit('/')
    })

    it('requests favorite fruits', function () {
      cy.wait('@fetchFruits').its('response.body')
      .then((fruits) => {
        cy.get('.favorite-fruits li').should('have.length', fruits.length)

        fruits.forEach((fruit) => {
          cy.contains('.favorite-fruits li', fruit)
        })
      })
    })

    it('spying on 2nd domain', () => {
      cy.intercept('https://jsonplaceholder.cypress.io/users').as('users')
      cy.get('#load-users').click()
      cy.wait('@users').its('response.body').should('have.length', 3)
      .its('0') // grab the first user from the list
      .then((user) => {
        expect(user).to.have.property('id')
        expect(user).to.have.property('username')
        expect(user).to.have.property('email')

        // the user should be shown on the page
        cy.contains('.user', `${user.id} - ${user.email}`).should('be.visible')
      })

      // there should be three users displayed on the page
      cy.get('.user').should('have.length', 3)
    })

    it('checks the status code', () => {
      cy.intercept('/users').as('users')
      cy.get('#load-five-users').click()
      cy.wait('@users').its('response').then((response) => {
        expect(response).to.include({
          statusCode: 200,
          statusMessage: 'OK',
        })

        // or check every property separately
        expect(response).property('statusCode').to.equal(200)
        expect(response).property('body').to.have.length(5)
      })
    })
  })

  context('spying on PUT request', () => {
    it('can spy using URL substring', () => {
      cy.visit('/')
      cy.intercept('PUT', '/users').as('updateUser')
      cy.get('#put-user').click()
      cy.wait('@updateUser').then((xhr) => {
        expect(xhr.response.statusCode).to.equal(200)
      })
    })

    // there is no difference how to write the URL matcher
    it('can spy using URL regexp', () => {
      cy.visit('/')
      cy.intercept('PUT', /\/users\/\d+$/).as('updateUser')
      cy.get('#put-user').click()
      cy.wait('@updateUser')
      .its('response')
      .should('deep.include', {
        statusCode: 200,
        body: {
          id: 1,
          name: 'Joe Smith',
        },
      })
    })

    it('can spy using URL case-insensitive regexp', () => {
      cy.visit('/')
      cy.intercept('PUT', /users/i).as('updateUser')
      cy.get('#put-user').click()
      cy.wait('@updateUser')
      .its('response.statusCode')
      .should('equal', 200)
    })
  })

  context('uses query', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    // there are two buttons on the page
    // one loads 3 users with "/users?_limit=3"
    // another loads 5 users with "/users?_limit=5"
    // let's spy on each request separately

    it('spies using full url', () => {
      cy.intercept('/users?_limit=3').as('users3')
      cy.intercept('/users?_limit=5').as('users5')

      cy.get('#load-users').click()
      cy.wait('@users3')

      cy.get('#load-five-users').click()
      cy.wait('@users5')
    })

    it('spies using query parameter', () => {
      cy.intercept({
        pathname: '/users',
        query: {
          _limit: '3',
        },
      }).as('users3')

      cy.intercept({
        pathname: '/users',
        query: {
          _limit: '5',
        },
      }).as('users5')

      cy.get('#load-users').click()
      cy.wait('@users3')

      cy.get('#load-five-users').click()
      cy.wait('@users5')
    })
  })
})
