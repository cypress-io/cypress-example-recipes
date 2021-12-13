/// <reference types="cypress" />
import 'cypress-pipe'

beforeEach(() => {
  cy.visit('index.html')
})

describe('HTML select element', () => {
  context('single value', () => {
    it('sets MA', () => {
      // https://on.cypress.io/select
      // set using value
      // <option value="MA">Massachusetts</option>
      cy.get('#my-state').select('MA')

      // confirm the selected value
      cy.get('#my-state').should('have.value', 'MA')
    })

    it('sets Massachusetts', () => {
      // https://on.cypress.io/select
      // set using text
      // <option value="MA">Massachusetts</option>
      cy.get('#my-state').select('Massachusetts')

      // confirm the selected value
      cy.get('#my-state').should('have.value', 'MA')
    })
  })

  context('multiple values', () => {
    it('adds several states', () => {
      // https://on.cypress.io/select
      // select multiple values by passing an array
      cy.get('#my-states').select(['MA', 'VT', 'CT'])

      // confirm the selected value - note that the values are sorted
      // and because it is an array we need to use deep equality
      // against the yielded list from ".invoke('val')"
      cy.get('#my-states').invoke('val').should('deep.equal', ['CT', 'MA', 'VT'])

      // remove the focus from <select> element
      cy.get('#my-states').blur()
    })
  })
})

describe('select2', () => {
  context('single value', () => {
    it('selects Massachusetts', () => {
      cy.log('--- Force select ---')

      // https://on.cypress.io/select
      // avoid error message that select element is covered
      // by the rendered Select2 widget by using "force: true" option
      cy.get('#favorite-state').select('MA', { force: true })

      // confirm the value of the selected element
      cy.get('#favorite-state').should('have.value', 'MA')

      // confirm Select2 widget renders the state name
      cy.get('#select2-favorite-state-container').should('have.text', 'Massachusetts')
    })

    it('selects Massachusetts by typing', () => {
      cy.log('--- Pick state by typing ---')
      // first, open the widget
      cy.get('#select2-favorite-state-container').click()
      // then type into the widget's input element
      // use custom selector to handle cases when there are multiple widgets
      // on the page. Also delay typing each character for better demo
      cy.get('input[aria-controls="select2-favorite-state-results"]').type('Mass{enter}', {
        delay: 500,
      })

      // confirm the value of the selected element
      cy.get('#favorite-state').should('have.value', 'MA')

      // confirm Select2 widget renders the state name
      cy.get('#select2-favorite-state-container').should('have.text', 'Massachusetts')

      // remove the focus remaining on the widget after typing
      // cy.get('.select2-selection').blur()
    })
  })

  context('multiple values', () => {
    it('adds several states', () => {
      // https://on.cypress.io/select
      // select multiple values by passing an array
      // again, have to use "force": "true" because the actual
      // select is covered by Select2 widget
      cy.get('#states').select(['MA', 'VT', 'CT'], { force: true })

      // confirm the selected value - note that the values are sorted
      // and because it is an array we need to use deep equality
      // against the yielded list from ".invoke('val')"
      cy.get('#states').invoke('val').should('deep.equal', ['CT', 'MA', 'VT'])

      // confirm Select2 widget renders the 3 state names
      cy.get('#states + .select2 .select2-selection__choice')
      // use ".should(cb)" to confirm the displayed values
      // https://on.cypress.io/should#Function
      .should((list) => {
        expect(list[0].title).to.equal('Connecticut')
        expect(list[1].title).to.equal('Massachusetts')
        expect(list[2].title).to.equal('Vermont')
      })

      // alternative: extract titles and then make an assertion
      // and use https://github.com/NicholasBoll/cypress-pipe
      // to preserve http://on.cypress.io/retry-ability
      const getTitles = (list) => Cypress._.map(list, (li) => li.title)

      cy.get('#states + .select2 .select2-selection__choice')
      .pipe(getTitles)
      .should('deep.equal', ['Connecticut', 'Massachusetts', 'Vermont'])
    })

    it('adds several states by typing', () => {
      // Select2 HTML widget is inserted after the corresponding <select> element
      // thus we can find it using " + " CSS selector
      cy.get('#states + .select2').click()
      // after we click on the Select2 widget, the search drop down and input appear
      .find('.select2-search')
      // type parts of the states' names, just like a real user would
      .type('Verm{enter}Mass{enter}Conn{enter}', { delay: 500 })

      // confirm the selected value - note that the values are sorted
      // and because it is an array we need to use deep equality
      // against the yielded list from ".invoke('val')"
      cy.get('#states').invoke('val').should('deep.equal', ['CT', 'MA', 'VT'])
    })

    it('removes state', () => {
      cy.get('#states + .select2').click()
      .find('.select2-search')
      .type('Verm{enter}Mass{enter}Conn{enter}')

      // confirm 3 states are selected
      cy.get('#states').invoke('val').should('deep.equal', ['CT', 'MA', 'VT'])

      // remove Connecticut, they don't have a major league team anyway
      cy.get('#states + .select2')
      .contains('.select2-selection__choice', 'Connecticut')
      .find('.select2-selection__choice__remove').click()

      // when removing an item, Select2 automatically expands choices
      // we can close them by pressing "Enter"
      cy.get('#states + .select2 .select2-search')
      .type('{enter}')

      // confirm the remaining selections
      cy.get('#states').invoke('val').should('deep.equal', ['MA', 'VT'])
    })
  })

  context('ajax data source', () => {
    // Select2 Ajax data fetch docs at https://select2.org/data-sources/ajax

    // NOTE: test shows what will NOT work
    it.skip('selects a value - WILL NOT WORK, JUST A DEMO', () => {
      // clicking on the container starts Ajax call
      cy.get('#select2-user-container').click()

      // we know the choice elements have this class
      cy.get('.select2-results__option')
      // so let's try finding the element with the text
      // WILL NOT WORK because our search is limited
      // to the initial empty set of results
      // from the previous ".get" command
      .contains('Leanne Graham').click()

      // confirm the right user is found
      cy.get('#user').should('have.value', '1')
      cy.get('#select2-user-container').should('have.text', 'Leanne Graham')
    })

    // NOTE: example of a flaky test where the element will be detached from the DOM
    // used as a blog post demo
    it.skip('selects a value by typing and selecting', () => {
      // if you want to stub network calls to simulate slow server responses
      // cy.server()
      // cy.route({
      //   url: 'https://jsonplaceholder.cypress.io/users?_type=query',
      //   response: 'fixture:query.json',
      //   delay: 1000,
      // }).as('query')

      // cy.route({
      //   url: 'https://jsonplaceholder.cypress.io/users?term=clem&_type=query&q=clem',
      //   response: 'fixture:clem.json',
      //   delay: 1000,
      // }).as('user_search')

      // first open the container, which makes the initial ajax call
      cy.get('#select2-user-container').click()

      // flake solution: wait for the widget to load the initial set of users
      // cy.get('.select2-results__option').should('have.length.gt', 3)

      // then type into the input element to trigger search, and wait for results
      cy.get('input[aria-controls="select2-user-results"]').type('clem')

      // flake solution: wait for the search for "clem" to finish
      // cy.get('.select2-results__option').should('have.length', 2)

      cy.contains('.select2-results__option', 'Clementine Bauch').should('be.visible')
      .click()

      // confirm Select2 widget renders the name
      cy.get('#select2-user-container').should('have.text', 'Clementine Bauch')
    })

    it('selects a value by waiting for loading class to go away', () => {
      // clicking on the container starts Ajax call
      cy.get('#select2-user-container').click()

      cy.get('.select2-results__option')
      .should('not.have.class', 'loading-results')
      // great, now the results are shown in the DOM
      .contains('Leanne Graham').click()

      // confirm the right user is found
      cy.get('#user').should('have.value', '1')
      cy.get('#select2-user-container').should('have.text', 'Leanne Graham')
    })

    it('selects a value by retrying', () => {
      // clicking on the container starts Ajax call
      cy.get('#select2-user-container').click()

      // we need to retry getting the option until it is found
      // then we can click it. To retry finding the element with text
      // we should use https://on.cypress.io/contains
      cy.contains('.select2-results__option', 'Leanne Graham').click()

      // confirm the right user is found
      cy.get('#user').should('have.value', '1')
      cy.get('#select2-user-container').should('have.text', 'Leanne Graham')
    })

    it('selects a value after the list has been is populated', () => {
      // clicking on the container starts Ajax call
      cy.get('#select2-user-container').click()

      // let's wait for the list of options to be populated
      // before trying to find a specific item
      cy.get('.select2-results__option').should('have.length.gt', 3)
      // and now we can find the user among the results
      cy.contains('.select2-results__option', 'Leanne Graham').click()

      // confirm the right user is found
      cy.get('#user').should('have.value', '1')
      cy.get('#select2-user-container').should('have.text', 'Leanne Graham')
    })

    it('selects a value after Ajax completes', () => {
      cy.server()
      cy.route('https://jsonplaceholder.cypress.io/users?_type=query').as('users')
      cy.get('#select2-user-container').click()
      cy.wait('@users')

      // The Ajax call has completed - but that does not mean the widget
      // has populated the DOM elements. Thus we need to use the same
      // retry mechanism until an option with expected text exists
      cy.contains('.select2-results__option', 'Leanne Graham').click()

      // confirm the right user is found
      cy.get('#user').should('have.value', '1')
      cy.get('#select2-user-container').should('have.text', 'Leanne Graham')
    })

    it('selects a value by typing and selecting (no flake)', () => {
      cy.server()
      cy.route('https://jsonplaceholder.cypress.io/users?_type=query').as('query')
      cy.route('https://jsonplaceholder.cypress.io/users?term=clem&_type=query&q=clem').as('user_search')

      // first open the container, which makes the initial ajax call
      cy.get('#select2-user-container').click()

      // let's wait for Select2 widget to finish its full query
      cy.wait('@query')

      cy.get('.select2-results__option')
      .should('not.have.class', 'loading-results')

      // then type into the input element to trigger search
      cy.get('input[aria-controls="select2-user-results"]')
      .type('clem', { delay: 150 })

      // and wait for results from XHR "query=clem"
      cy.wait('@user_search')
      .its('responseBody.length').then((numberOfResults) => {
        // make sure the Select2 has updated to show just
        // the above number of items. Otherwise the next
        // step might fail since the widget suddenly re-renders
        // to show only the new results
        cy.get('.select2-results__option').should('have.length', numberOfResults)
      })

      // select a value, again by retrying command
      // https://on.cypress.io/retry-ability
      cy.contains('.select2-results__option', 'Clementine Bauch').should('be.visible').click()

      // confirm the value of the selected element
      cy.get('#user').should('have.value', '3')

      // confirm Select2 widget renders the name
      cy.get('#select2-user-container').should('have.text', 'Clementine Bauch')
    })

    it('selects the user returned by the Ajax call', () => {
      // instead of hard-coding the user id and name, let's
      // select the user using the Ajax response data
      cy.server()
      cy.route('https://jsonplaceholder.cypress.io/users?_type=query').as('users')
      cy.get('#select2-user-container').click()
      cy.wait('@users').its('responseBody').should('have.length', 10)
      // let's take user #5
      .its('5')
      .then((user) => {
        expect(user).to.have.property('name')
        expect(user).to.have.property('id')

        cy.contains('.select2-results__option', user.name).click()
        // the Select2 widget picks the right user
        cy.get('#user').should('have.value', user.id)
        cy.get('#select2-user-container').should('have.text', user.name)
      })
    })

    it('selects the user from stubbed Ajax call', () => {
      cy.server()
      // do not go to the server, mock the response instead
      // but return the response after a delay
      cy.route({
        url: 'https://jsonplaceholder.cypress.io/users?_type=query',
        response: [{
          id: 101,
          name: 'Joe Smith',
        }, {
          id: 201,
          name: 'Mary Jane',
        }],
        delay: 2000,
      })

      cy.get('#select2-user-container').click()

      // keep retrying finding the element until it is present
      cy.contains('.select2-results__option', 'Mary Jane', { timeout: 2500 }).click()

      // confirm the user was selected
      cy.get('#user').should('have.value', 201)
      cy.get('#select2-user-container').should('have.text', 'Mary Jane')
    })
  })

  context('programmatic control', () => {
    it('returns selected items', () => {
      cy.get('#states').select(['MA', 'VT', 'CT'], { force: true })
      // https://select2.org/programmatic-control/retrieving-selections
      cy.get('#states').invoke('select2', 'data')
      .should((list) => {
        const names = Cypress._.map(list, 'text')

        expect(names).to.deep.equal(['Connecticut', 'Massachusetts', 'Vermont'])
      })
    })
  })
})
