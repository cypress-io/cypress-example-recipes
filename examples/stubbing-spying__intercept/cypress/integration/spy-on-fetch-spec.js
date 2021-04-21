/// <reference types="Cypress" />

// https://on.cypress.io/intercept
describe('intercept', () => {
  /**
   * Implementation detail, returns number of times an intercept route
   * was matched during the test
   * @param {string} alias
   */
  const getAliasCount = (alias) => {
    const testRoutes = cy.state('routes')
    const aliasRoute = Cypress._.find(testRoutes, { alias })

    if (!aliasRoute) {
      return
    }

    return Cypress._.keys(aliasRoute.requests || {}).length
  }

  context('fruits', () => {
    it('requests favorite fruits', function () {
      cy.intercept('/favorite-fruits').as('fetchFruits')
      cy.visit('/fruits.html')
      cy.wait('@fetchFruits').its('response.body')
      .then((fruits) => {
        cy.get('.favorite-fruits li')
        .should('have.length', fruits.length)

        fruits.forEach((fruit) => {
          cy.contains('.favorite-fruits li', fruit)
        })
      })
    })

    it('requests favorite fruits: wait and get', function () {
      cy.intercept('/favorite-fruits').as('fetchFruits')
      cy.visit('/fruits.html')
      // wait on the request once
      cy.wait('@fetchFruits')
      // but get the latest request as many times as needed
      cy.get('@fetchFruits').its('response.statusCode')
      .should('eq', 200)

      cy.get('@fetchFruits').its('response.body')
      .should('have.length.gt', 3)
    })

    it('requests favorite fruits: multiple assertions', function () {
      cy.intercept('/favorite-fruits').as('fetchFruits')
      cy.visit('/fruits.html')
      cy.wait('@fetchFruits').then((intercept) => {
        expect(intercept.response.statusCode, 'status code').to.equal(200)
        expect(intercept.response.body, 'at least 3 fruits').to.have.length.gt(3)
      })
      // also see https://www.cypress.io/blog/2019/12/23/asserting-network-calls-from-cypress-tests/
    })
  })

  context('spying', function () {
    beforeEach(function () {
      cy.visit('/')
    })

    it('spying on 2nd domain', () => {
      cy.intercept('https://jsonplaceholder.cypress.io/users*').as('users')
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

    it('spies on multiple requests', () => {
      cy.intercept({
        method: 'POST',
        pathname: '/users',
      }).as('postUser')

      cy.get('#post-user').click()
      cy.wait('@postUser').its('response.statusCode').should('equal', 201)

      // post 2nd time
      cy.get('#post-user').click()
      cy.wait('@postUser').its('response.statusCode').should('equal', 201)

      // post 3rd time
      cy.get('#post-user').click()
      cy.wait('@postUser').its('response.statusCode').should('equal', 201)

      // post 4th time
      cy.get('#post-user').click()
      cy.wait('@postUser').its('response.statusCode').should('equal', 201)
    })

    it('checks the status code', () => {
      cy.intercept('/users*').as('users')
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

    // NOTE: shows how an assertion inside the intercept fails the test
    it.skip('fails if XHR has wrong data', () => {
      cy.intercept('/users', (req) => {
        const url = new URL(req.url)
        const limit = parseFloat(url.searchParams.get('_limit'))

        // make the assertion fail on purpose
        expect(limit, 'limit').to.equal(100)
      }).as('users')

      cy.get('#load-five-users').click()
      cy.wait('@users')
    })
  })

  context('spying on PUT request', () => {
    it('can spy using path', () => {
      cy.visit('/')
      cy.intercept('PUT', '/users/1').as('updateUser')
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

      // let's click the buttons again
      cy.get('#load-users').click()
      cy.wait('@users3').its('response.statusCode').should('equal', 200)

      cy.get('#load-five-users').click()
      cy.wait('@users5').its('response.statusCode').should('equal', 200)
    })

    it('confirms the number of times an intercept was called', () => {
      cy.intercept('/users?_limit=3').as('users3')
      cy.intercept('/users?_limit=5').as('users5')

      cy.get('#load-users').click().click()
      cy.wait('@users3')

      // to avoid clicking too quickly, add small pauses
      cy.get('#load-five-users').click()
      .wait(20).click()
      .wait(20).click()
      .wait(20).click()

      // use "cy.should" to re-run the callback function
      // until it times out or the assertions pass
      cy.should(() => {
        // IMPLEMENTATION DETAILS
        // count the number of requests matching "users3"
        const users3 = getAliasCount('users3')

        expect(users3, 'limit=3').to.equal(2)
        const users5 = getAliasCount('users5')

        expect(users5, 'limit=5').to.equal(4)
      })
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
