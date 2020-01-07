/// <reference types="cypress" />
describe('XHR', () => {
// NOTE: this is a demo of failing test
  it.skip('cy.get yields null if the network request has not happened yet', () => {
    cy.visit('index.html')

    cy.server()
    cy.route('POST', '/posts').as('post')

    cy.get('#delayed-load').click()
    // cy.get does NOT work
    // because it immediately returns null object,
    // since the request has not happened yet
    cy.get('@post').should('have.property', 'status', 201)
  })

  it('cy.wait waits for the network request to happen', () => {
    cy.visit('index.html')

    cy.server()
    cy.route('POST', '/posts').as('post')

    cy.get('#delayed-load').click()
    cy.wait('@post').should('have.property', 'status', 201)
  })

  it('cy.wait then cy.get to retrieve the same XHR', () => {
    cy.visit('index.html')

    cy.server()
    cy.route('POST', '/posts').as('post')

    cy.get('#delayed-load').click()
    // there is only 1 POST request
    cy.wait('@post').then((xhr1) => {
    // ask for the XHR again using cy.get
    // by now it has happened for sure,
    // and cy.get should yield same XHR object
      cy.get('@post').then((xhr2) => {
        expect(xhr1, 'same XHR').to.equal(xhr2)
      })
    })
  })
})
