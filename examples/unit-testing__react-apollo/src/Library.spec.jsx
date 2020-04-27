import React from 'react'
import { Library, GET_BOOKS } from './App'
import { mount } from 'cypress-react-unit-test'
import { MockedProvider } from '@apollo/react-testing'

// mocking GraphQL requests using
// https://www.apollographql.com/docs/react/development-testing/testing/#mockedprovider
describe('Library', () => {
  beforeEach(() => {
    cy.fixture('books')
    .as('books')
  })

  it('loads mock data', function () {
    // "this.books" points at the object loaded
    // in the "beforeEach" hook
    const mocks = [
      {
        request: {
          query: GET_BOOKS,
        },
        result: this.books,
      },
    ]

    mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Library />
      </MockedProvider>
    )

    cy.get('[data-cy=book]').should('have.length', 2)
  })

  it('shows loading while making the query', function () {
    // delays the response by 3 seconds
    const mocks = [
      {
        request: {
          query: GET_BOOKS,
        },
        result: this.books,
        delay: 3000,
      },
    ]

    mount(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Library />
      </MockedProvider>
    )

    // 😀 compare declarative testing vs promise waits in
    // https://www.apollographql.com/docs/react/development-testing/testing/#testing-final-state
    cy.contains('Loading ...').should('be.visible')
    cy.get('[data-cy=book]').should('have.length', 2)
    cy.contains('Loading ...').should('not.exist')
  })
})
