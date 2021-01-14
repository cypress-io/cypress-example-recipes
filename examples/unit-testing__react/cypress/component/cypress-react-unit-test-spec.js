/// <reference types="cypress" />
/* eslint-disable react/jsx-filename-extension */
import { mount } from '@cypress/react'
import React from 'react'
import Greeting from '../../greeting'

describe('@cypress/react', () => {
  it('shows greeting', () => {
    mount(<Greeting />)
    cy.contains('Hello World')
  })

  it('changes greeting on click', () => {
    mount(<Greeting />)
    cy.get('button').click()
    cy.contains('Bonjour World')
  })
})
