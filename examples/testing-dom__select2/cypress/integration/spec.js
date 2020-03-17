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
