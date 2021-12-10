/// <reference types="cypress" />
describe('Google Analytics', () => {
  // we can arrange the intercepts to be in a particular order in each test
  // by making small utility functions rather than using "beforeEach" hooks

  beforeEach(() => {
    cy.log('**stub all GA calls**')
    // Do not let collect network calls get to Google Analytics. Instead intercept them
    // returning the status code 200. Since different events use different endpoints
    // let's define two intercepts to be precise
    cy.intercept('POST', 'https://www.google-analytics.com/j/collect*', { statusCode: 200 }).as('collect')
    cy.intercept('GET', 'https://www.google-analytics.com/collect*', { statusCode: 200 }).as('gifCollect')

    cy.log('**visiting the page**')
    cy.visit('/index.html')
    // tip: cy.visit yields the window object
    // confirm the `window.ga` function has been created
    .its('ga').should('be.a', 'function')
  })

  it('makes collect calls', () => {
    // confirm the GA called the collect endpoint
    cy.wait('@collect').its('request.url')
    // extract the information from the URL search params step by step
    .then((s) => new URL(s)).its('searchParams').invoke('get', 't').should('equal', 'pageview')

    cy.contains('#page2').click()

    cy.hash().should('equal', '#page2')
    // let's confirm the event and the "page=#page2"
    cy.wait('@gifCollect').its('request.url')
    .then((s) => new URL(s)).its('searchParams').then((url) => {
      return {
        type: url.get('t'),
        page: url.get('dp'),
      }
    }).should('deep.equal', {
      type: 'pageview',
      page: '#page2',
    })

    cy.contains('#page3').click()
    // let's confirm the event and the "page=#page3"
    // and let's use the helper function
    cy.wait('@gifCollect').then(interceptToPageEvent).should('deep.equal', {
      type: 'pageview',
      page: '#page3',
    })
  })

  it('sends button click event', () => {
    // because we use stubs we place our "Register" button intercept first
    cy.log('**stub GA click event**')
    // let's be very explicit about the expected call
    // by using the hostname, pathname, and some of the query parameters
    cy.intercept({
      hostname: 'www.google-analytics.com',
      // pathname: '/collect',
      query: {
        ec: 'button',
        ea: 'click',
        el: 'Register',
      },
    }, {
      statusCode: 200,
    }).as('register')

    cy.contains('button', 'Register').click()
    cy.wait('@register') // the page has sent the GA event on click
    .its('response.statusCode').should('equal', 200)
  })

  /**
   * Little utility method to extract the URL search parameters from the given interception
   */
  const interceptToPageEvent = (intercept) => {
    return cy.wrap(intercept, { log: false }).its('request.url', { log: false })
    .then((s) => new URL(s)).its('searchParams', { log: false }).then((url) => {
      return {
        type: url.get('t'),
        page: url.get('dp'),
      }
    })
  }
})
