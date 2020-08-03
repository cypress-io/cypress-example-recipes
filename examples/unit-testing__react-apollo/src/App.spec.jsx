import React from 'react'
import App from './App'
import { mount } from 'cypress-react-unit-test'
import ApolloClient from 'apollo-boost'

describe('App', () => {
  beforeEach(() => {
    cy.fixture('books')
    .then(JSON.stringify)
    .as('booksText')
  })

  // FIXME: this tests fails due to a cross-origin error from codesandbox.io
  // https://github.com/cypress-io/cypress-example-recipes/issues/534
  it.skip('loads real thing', () => {
    mount(<App />)
    // it might take a while to load real data from remote server
    cy.get('[data-cy=book]', { timeout: 20000 })
    .should('have.length.gte', 1)
  })

  it('can mock window fetch', function () {
    cy.stub(window, 'fetch').withArgs('https://test/')
    .resolves({
      text: cy.stub().resolves(this.booksText).as('text'),
    }).as('fetch')

    const client = new ApolloClient({
      uri: 'https://test/',
    })

    mount(<App apolloClient={client} />)
    cy.get('[data-cy=book]').should('have.length', 2)
  })

  it('handles errors', () => {
    cy.stub(window, 'fetch')
    .withArgs('https://test/')
    .rejects(new Error('Nope'))

    const client = new ApolloClient({
      uri: 'https://test/',
    })

    mount(<App apolloClient={client} />)
    cy.contains('Error :(').should('be.visible')
  })
})
