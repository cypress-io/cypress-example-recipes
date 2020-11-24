/// <reference types="cypress" />
/* eslint-disable no-console */

// prevent rare flake in these tests due to json-server
// not being very strong when hit from multiple clients
describe('XHR', { retries: 3 }, () => {
  it('sends XHR to the server and gets expected response', () => {
    cy.visit('index.html')

    // before the request goes out we need to set up spying
    // see https://on.cypress.io/network-requests
    cy.server()
    cy.route('POST', '/posts').as('post')

    cy.get('#load').click()
    // make sure the XHR completes and the UI changes
    cy.contains('#output', '"title": "example post"').should('be.visible')

    // because the UI has changed, we know the XHR has completed
    // and we can retrieve it using cy.get(<alias>)
    // see https://on.cypress.io/get

    // increase the command timeout, because Ajax request
    // can take longer on CI than expected
    cy.get('@post', { timeout: 150000 })
    // tip: log the request object to see everything it has in the console
    .then(console.log)
  })

  it('gets the expected response', () => {
    cy.visit('index.html')

    // before the request goes out we need to set up spying
    // see https://on.cypress.io/network-requests
    cy.server()
    cy.route('POST', '/posts').as('post')

    cy.get('#load').click()
    // make sure the XHR completes and the UI changes
    cy.contains('#output', '"title": "example post"').should('be.visible')

    // because the UI has changed, we know the XHR has completed
    // and we can retrieve it using cy.get(<alias>)
    // see https://on.cypress.io/get

    // tip: log the request object to see everything it has in the console
    cy.get('@post').then(console.log)

    // you can retrieve the XHR multiple times - returns the same object
    // confirm the request status
    cy.get('@post').should('have.property', 'status', 201)

    // we cannot chain any more assertions to the above request object
    // because the "have.property" assertion yields the property's value
    // so let's just grab the request object again and run multiple assertions
    cy.get('@post').should((req) => {
      expect(req.method).to.equal('POST')
      expect(req.url).to.match(/\/posts$/)
      // it is good practice to add message to the assertion
      expect(req, 'has duration in ms').to.have.property('duration').and.be.a('number')
    })

    // let's confirm the request sent to the server
    cy.get('@post').its('request.body').should('deep.equal', {
      title: 'example post',
      body: 'this is a post sent to the server',
      userId: 1,
    })

    // alternative: use "requestBody" alias to "request.body" property access
    cy.get('@post').its('requestBody')
    .should('have.property', 'title', 'example post')

    // get the same request object again and confirm the response
    cy.get('@post').its('response').then((res) => {
    // because the response object is not going to change
    // we can use cy.then() callback to run assertions just once
    // without retrying
    // see https://on.cypress.io/then and https://on.cypress.io/retry-ability
      expect(res.headers).to.include({
        'cache-control': 'no-cache',
        expires: '-1',
        'content-type': 'application/json; charset=utf-8',
        location: 'http://jsonplaceholder.cypress.io/posts/101',
      })

      // it is a good practice to add message argument to the
      // assertion "expect(value, message)..." that will be shown
      // in the test runner's command log
      expect(res.body, 'response body').to.deep.equal({
        body: 'this is a post sent to the server',
        id: 101,
        title: 'example post',
        userId: 1,
      })
    })
  })

  it('sends request after delay', () => {
    cy.visit('index.html')

    // before the request goes out we need to set up spying
    // see https://on.cypress.io/network-requests
    cy.server()
    cy.route('POST', '/posts').as('post')

    cy.get('#delayed-load').click()

    // the XHR request has NOT happened yet - we are not checking the UI
    // to "wait" for it. Thus we cannot use cy.get("@post"),
    // instead we need to wait for the request to happen
    // using cy.wait("@post") call
    //
    //  https://on.cypress.io/wait
    cy.wait('@post').should((xhr) => {
      expect(xhr.status, 'successful POST').to.equal(201)
      expect(xhr.url, 'post url').to.match(/\/posts$/)
    // assert any other XHR properties
    })

    // if you need to assert again, retrieve the same XHR object
    // using cy.get(<alias>) - because by now the request has happened
    cy.get('@post').its('request.body').should('deep.equal', {
      title: 'example post',
      body: 'this is a post sent to the server',
      userId: 1,
    })
  })
})
