/// <reference types="Cypress" />

describe('intercept', () => {
  context('matches order', () => {
    describe('multiple matches', () => {
      it('uses the first found route matcher that responds', () => {
        cy.intercept('*-fruits').as('fruits') // does not reply
        cy.intercept('favorite-*', ['Lemons 🍋']).as('favorite') // replies with a fruit
        cy.intercept('favorite-fruits').as('favorite-fruits') // does not reply

        cy.visit('/')
        cy.wait('@fruits') // first route matches
        cy.wait('@favorite') // second route matches
        // but the third route never gets the request
        // since the second route has replied
        cy.contains('li', 'Lemons 🍋').should('be.visible')
      })

      it('using substring matches multiple interceptors', () => {
        cy.visit('/')
        cy.intercept('/users').as('users')
        cy.intercept('/users/2').as('secondUser')
        cy.get('#load-second-user').click()

        // confirm that both interceptors are matched
        cy.wait('@users')
        .its('request.url')
        .should('equal', 'https://jsonplaceholder.cypress.io/users/2')

        cy.wait('@secondUser')
        .its('request.url')
        .should('equal', 'https://jsonplaceholder.cypress.io/users/2')
      })

      it('use regex to match exactly', () => {
        // if you want to be precise, use regular expressions
        cy.visit('/')
        cy.intercept(/\/users$/).as('users')
        cy.intercept(/\/users\/2$/).as('secondUser')
        cy.get('#load-second-user').click()
        // only the second interceptor should match
        cy.wait('@secondUser')
        .its('request.url')
        .should('equal', 'https://jsonplaceholder.cypress.io/users/2')
      })

      it('use regex to match exactly and check if the other intercept has not fired', () => {
        cy.visit('/')
        let usersMatched = false

        cy.intercept(/\/users$/, () => {
          usersMatched = true
        })

        cy.intercept(/\/users\/2$/).as('secondUser')
        cy.get('#load-second-user').click()
        // only the second interceptor should match
        cy.wait('@secondUser')
        .its('request.url')
        .should('equal', 'https://jsonplaceholder.cypress.io/users/2')
        // but the first intercept should have never fired
        .then(() => {
          expect(usersMatched, 'users intercept').to.be.false
        })
      })
    })

    describe('when starts with a slash', () => {
      // seems minimatch fails if the matcher URL starts with a /
      // and includes * character

      it('matches using minimatch', () => {
        // our application issues GET "/favorite-fruits"
        // which matches all these wildcards
        // NOTE: we are matching full url
        const URL = `${Cypress.config('baseUrl')}/favorite-fruits`

        expect(Cypress.minimatch(URL, '**/*-fruits'), '**/*-fruits').to.be.true
        expect(Cypress.minimatch(URL, '**/favorite-*'), '**/favorite-*').to.be.true
        expect(Cypress.minimatch(URL, '**/favorite-fruits'), '**/favorite-fruits').to.be.true
      })

      it('matches *-fruits', () => {
        cy.intercept('**/*-fruits').as('fruits')
        cy.visit('/')
        cy.wait('@fruits')
      })

      it('matches favorite-*', () => {
        cy.intercept('**/favorite-*').as('favorite')
        cy.visit('/')
        cy.wait('@favorite')
      })

      it('matches favorite-fruits', () => {
        cy.intercept('**/favorite-fruits').as('favorite-fruits')
        cy.visit('/')
        cy.wait('@favorite-fruits')
      })

      it('matches all routes that do not respond', () => {
        cy.intercept('**/*-fruits').as('fruits')
        cy.intercept('**/favorite-*').as('favorite')
        cy.intercept('**/favorite-fruits').as('favorite-fruits')

        cy.visit('/')
        // matches all 3 routes
        cy.wait('@fruits')
        cy.wait('@favorite')
        cy.wait('@favorite-fruits')
      })

      it('uses the first found route matcher (2)', () => {
        cy.intercept('**/*-fruits-does-not-exist').as('fruits') // this does not match
        cy.intercept('**/favorite-*').as('favorite')
        cy.intercept('**/favorite-fruits').as('favorite-fruits')

        cy.visit('/')
        // matches last two routes
        cy.wait('@favorite')
        cy.wait('@favorite-fruits')
      })
    })

    describe('without minimatch, just wildcards', () => {
      it('matches *-fruits', () => {
        cy.intercept('*-fruits').as('fruits')
        cy.visit('/')
        cy.wait('@fruits')
      })

      it('matches favorite-*', () => {
        cy.intercept('favorite-*').as('favorite')
        cy.visit('/')
        cy.wait('@favorite')
      })

      it('matches favorite-fruits', () => {
        cy.intercept('favorite-fruits').as('favorite-fruits')
        cy.visit('/')
        cy.wait('@favorite-fruits')
      })

      it('matches all routes that do not respond', () => {
        cy.intercept('*-fruits').as('fruits')
        cy.intercept('favorite-*').as('favorite')
        cy.intercept('favorite-fruits').as('favorite-fruits')

        cy.visit('/')
        // all 3 routes match
        cy.wait('@fruits')
        cy.wait('@favorite')
        cy.wait('@favorite-fruits')
      })
    })
  })

  context('using regex', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('intercepts user #2 with exact URL', () => {
      cy.intercept('/users/2').as('second')
      cy.get('#load-second-user').click()

      cy.contains('.user', '2 - Shanna@melissa.tv').should('be.visible')
      cy.wait('@second').its('response.body').should('include', {
        email: 'Shanna@melissa.tv',
      })
    })

    it('gets any user using regex', () => {
      cy.intercept(/\/users\/\d+$/).as('anyUser')
      cy.get('#load-second-user').click()

      cy.contains('.user', '2 - Shanna@melissa.tv').should('be.visible')
      cy.wait('@anyUser').its('response.body').should('include', {
        id: 2,
        email: 'Shanna@melissa.tv',
      })
    })

    it('mocks a user using regex', () => {
      cy.intercept(/\/users\/\d+$/, {
        body: {
          id: 101,
          email: 'test-user@cypress.io',
        },
        headers: {
          'access-control-allow-origin': Cypress.config('baseUrl'),
        },
      }).as('anyUser')

      cy.get('#load-second-user').click()

      cy.wait('@anyUser').its('request.url')
      // let the browser parse the url for us
      .then((url) => new URL(url)).should('have.property', 'pathname', '/users/2')

      cy.contains('.user', '101 - test-user@cypress.io').should('be.visible')
    })
  })
})
