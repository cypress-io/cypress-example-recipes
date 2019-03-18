/// <reference types="cypress" />
import 'cypress-react-unit-test'
import React from 'react'
import Greeting from '../../greeting'

describe('cypress-react-unit-test', () => {
  it('shows greeting', () => {
    cy.mount(<Greeting />)
    cy.contains('Hello World')
  })

  it('changes greeting on click', () => {
    cy.mount(<Greeting />)
    cy.get('button').click()
    cy.contains('Bonjour World')
  })
})
