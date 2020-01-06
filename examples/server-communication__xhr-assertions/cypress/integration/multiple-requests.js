/// <reference types="cypress" />
describe('waits', () => {
  it('for multiple requests to finish', () => {
    cy.visit('index.html')
    cy.server()
    cy.route('POST', '/posts').as('post')

    // click both buttons - there will be 2 XHR requests going out
    cy.get('#load').click()
    cy.get('#delayed-load').click()

    // there are two XHR calls matching our route
    // wait for both to complete
    cy.wait('@post').wait('@post')

    // we can retrieve all matching requests using the following syntax
    // cy.get('<alias>.all')
    cy.get('@post.all').should('have.length', 2)
    .then((xhrs) => {
    // xhrs is an array of network call objects
      expect(xhrs[0], 'first request status').to.have.property('status', 201)
      expect(xhrs[1], 'second request status').to.have.property('status', 201)
    })

    // and we can make assertions about each separate call
    // by retrieving it like this (index starts with 1)
    // cy.get('<alias>.<index>')
    cy.get('@post.1').should((xhr1) => {
      expect(xhr1, 'first request').to.have.property('status', 201)
    })

    cy.get('@post.2').its('response.body.id').should('equal', 101)
  })
})
