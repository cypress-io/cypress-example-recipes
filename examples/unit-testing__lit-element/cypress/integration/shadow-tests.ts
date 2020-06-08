/// <reference types="cypress" />

describe('element-one', () => {
  beforeEach(() => {
    cy.visit('/index.html')
  })

  it('renders a button', () => {
    cy
    .get('element-one')
    .shadow()
    .find('button')
    .should('exist')
  })

  it('renders a message on button click', () => {
    cy
    .get('element-one')
    .shadow()
    .find('button')
    .click()

    cy
    .get('element-one')
    .shadow()
    .find('p')
    .then((node) => {
      expect(node.text()).to.equal('I am element 1!')
    })
  })
})

describe('element-two', () => {
  it('renders a default slot', () => {
    cy
    .get('element-two')
    .find('.container > slot', { includeShadowDom: true })
    .then(($slot) => {
      expect($slot[0].assignedElements()[0]).to.equal(cy.$$('element-two > p')[0])
    })
  })
})
