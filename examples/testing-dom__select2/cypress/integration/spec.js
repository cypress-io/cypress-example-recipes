/// <reference types="cypress" />
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
      // Select2 widget is inserted immediately after our <select> node
      // thus we can click on it using CSS " + " selector
      cy.get('#favorite-state + .select2').click()
      cy.get('input[aria-controls="select2-favorite-state-results"]').type('Mass{enter}')

      // confirm the value of the selected element
      cy.get('#favorite-state').should('have.value', 'MA')

      // confirm Select2 widget renders the state name
      cy.get('#select2-favorite-state-container').should('have.text', 'Massachusetts')
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

      // TODO find a shorter way to express the assertion?
      // .should('have.length', 3)
      // .then((list) => list.map((k, el) => el.title))
      // .should('deep.equal', ['Connecticut', 'Massachusetts', 'Vermont'])
    })

    it('adds several states by typing', () => {
      // Select2 HTML widget is inserted after the corresponding <select> element
      // thus we can find it using " + " CSS selector
      cy.get('#states + .select2').click()
      // after we click on the Select2 widget, the search drop down and input appear
      .find('.select2-search')
      // type parts of the states' names, just like a real user would
      .type('Verm{enter}Mass{enter}Conn{enter}')

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
})
