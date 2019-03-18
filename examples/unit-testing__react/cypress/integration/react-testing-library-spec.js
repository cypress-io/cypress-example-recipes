import React from 'react'
import { render } from 'react-testing-library'
import Greeting from '../../greeting'

describe('react-testing-library', () => {
  it('renders Greeting', () => {
    const { getByText } = render(<Greeting />)
    getByText('Hello World')
  })

  it('changes greeting on click', () => {
    const component = render(<Greeting />)
    component
      .getByLabelText('greeting')
      .querySelector('button')
      .click()
    component.getByText('Bonjour World')
  })
})
