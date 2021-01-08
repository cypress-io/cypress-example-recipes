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
      // let's parse the URL and extract the search parameters
      const parsed = new URL(url)
      // convert URLSearchParams into a plain object
      const searchParams = Object.fromEntries(parsed.searchParams)

      // compare the form submission to the expected values
      expect(searchParams).to.deep.equal({
        fname: 'Joe',
        lname: 'Smith',
      })
    })

    // equivalent fluent function chain
    // due to JavaScript "new" keyword, have to create a helper
    // https://glebbahmutov.com/blog/work-around-the-keyword-new-in-javascript/
    const invokeConstructor = (constructor) => (arg) => new constructor(arg)

    cy.get('@submitForm')
    .its('request.url')
    .then(invokeConstructor(URL))
    .its('searchParams')
    .then(Object.fromEntries)
    .should('deep.equal', {
      fname: 'Joe',
      lname: 'Smith',
    })

    // make sure our redirect has worked
    cy.location('pathname').should('equal', '/form')
  })
})
