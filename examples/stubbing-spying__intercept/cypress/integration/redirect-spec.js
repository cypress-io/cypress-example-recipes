/// <reference types="Cypress" />

describe('intercept redirects', () => {
  beforeEach(() => {
    cy.visit('/redirect-example')
  })

  it('spies on the redirect', () => {
    // spy on logout call
    // because the redirected page stays on the same domain
    // the test can happily continue
    cy.intercept('/logout').as('logout')

    cy.get('#logout').click()
    cy.wait('@logout').its('response.statusCode').should('equal', 302)
    cy.location('pathname').should('equal', '/') // redirect worked
  })

  it('stubs the redirect', () => {
    // stub the redirect call and once it returns from the server
    // verify the target location and then change it to a safe "/"
    cy.intercept('/getout', (req) => {
      req.reply((res) => {
        expect(res.statusCode).to.equal(302)
        // the server wants to redirect us to another domain
        expect(res.headers).to.have.property('location', 'https://www.cypress.io')
        res.headers.location = '/'
        // need to provide something for the updated "res"
        // object to be used
        // https://github.com/cypress-io/cypress/issues/9555
        res.send('stay here')
      })
    })

    cy.get('#getout').click()
    cy.location('pathname').should('equal', '/') // redirect worked
  })
})
