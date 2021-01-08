/// <reference types="Cypress" />
/* eslint-disable no-console */
describe('intercept', () => {
  it('stubs form submission', () => {
    cy.visit('/form')
    cy.get('input#fname').type('Joe')
    cy.get('input#lname').type('Smith')

    cy.intercept({
      pathname: '/submit-form',
    }, (req) => {
      req.redirect('/form')
    }).as('submitForm')

    cy.get('form').submit()
    cy.wait('@submitForm').its('request.url').then((url) => {
      // the url has form fields in its query
      console.log('form submit url', url)
    })
  })
})
