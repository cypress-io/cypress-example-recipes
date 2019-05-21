/// <reference types="cypress" />
import React from 'react'
import Header from '../../src/components/Header'

describe('Header', () => {
  it('calls addTodo', () => {
    const addTodo = cy.stub()
    cy.mount(<Header addTodo={addTodo} />)

    cy.get('input')
      .type('test Header{enter}')
      .then(() => {
        expect(addTodo).to.have.been.calledWithExactly('test Header')
      })
  })

  it('does not call addTodo if text is empty', () => {
    const addTodo = cy.stub()
    cy.mount(<Header addTodo={addTodo} />)
    cy.get('input')
      .type('{enter}')
      .then(() => {
        expect(addTodo).to.not.have.been.called
      })
  })
})
