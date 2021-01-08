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

    cy.get('form#params').submit()
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

  it('stubs multipart form', () => {
    cy.visit('/form')
    cy.get('[name=city]').type('Boston')
    cy.get('[name=value]').type(28)

    cy.intercept({
      method: 'POST',
      pathname: '/submit-form',
    }, (req) => {
      req.redirect('/form')
    }).as('submitForm')

    cy.get('form#multipart').submit()

    // make sure our redirect has worked
    cy.location('pathname').should('equal', '/form')

    cy.wait('@submitForm').its('request').then(({ headers, body }) => {
      expect(body, 'request body').to.be.a('ArrayBuffer')
      const contentType = headers['content-type']

      // the browser sets the separator string when sending the form
      // something like
      // "multipart/form-data; boundary=----WebKitFormBoundaryiJZt6b3aUg8Jybg2"
      // we want to extract it and pass to the utility function
      // to convert the multipart text into an object of values
      expect(contentType, 'boundary').to.match(/^multipart\/form-data; boundary=/)
      const boundary = contentType.split('boundary=')[1]
      const values = parseMultipartForm({ boundary, buffer: body })

      expect(values, 'form values').to.deep.equal({
        city: 'Boston',
        value: '28', // note this is a string
      })
    })
  })
})

/*
  Utility: parses (very simply) multipart buffer into string values.

  the decoded buffer string will be something like
  ------We  bKitFormBoundaryYxsB3tlu9eJsoCeY
  Content-Disposition: form-data; name="city"

  Boston
  ------WebKitFormBoundaryYxsB3tlu9eJsoCeY
  Content-Disposition: form-data; name="value"

  28
  ------WebKitFormBoundaryYxsB3tlu9eJsoCeY--

  there are NPM packages for parsing such text into an object:
  - https://www.npmjs.com/package/parse-multipart
  - https://www.npmjs.com/package/multiparty
  - https://www.npmjs.com/package/busboy
  - https://www.npmjs.com/package/formidable
  */
const parseMultipartForm = ({ boundary, buffer }) => {
  expect(boundary, 'boundary').to.be.a('string')
  const decoder = new TextDecoder()
  const decoded = decoder.decode(buffer)

  const parts = decoded.split(`--${boundary}`)
  .map((s) => s.trim())
  .filter((s) => s.startsWith('Content-Disposition: form-data;'))

  console.log(decoded)
  console.log(parts)

  const result = {}

  parts.forEach((part) => {
    const lines = part.split(/\r?\n/g)

    console.log('lines')
    console.log(lines)
    const key = lines[0].match(/name="(.+)"/)[1]

    result[key] = lines[2].trim()
  })

  return result
}
