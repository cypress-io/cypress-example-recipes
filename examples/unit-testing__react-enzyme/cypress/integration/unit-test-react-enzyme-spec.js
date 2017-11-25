import Adapter from 'enzyme-adapter-react-16'
import React from 'react'
import chaiEnzyme from 'chai-enzyme'
import { configure, shallow } from 'enzyme'

import Greeting from '../../greeting'

// HACK: chai-enzyme does not play nice with chai-jquery, so remove the
// problem-causing assertions that collide with chai-jquery
'visible hidden selected checked enabled disabled'.split(' ').forEach((selector) => {
  Object.defineProperty(chai.Assertion.prototype, selector, { get: () => {} })
})

// Cypress automatically exposes the 'chai'
// global to all spec files. This enables us
// to extend chai with enzyme specific assertions
// for this one spec file.
//
// Alternatively we could move this configuration
// into cypress/support/assertions to enable all
// spec files to use these chai-enzyme assertions
chai.use(chaiEnzyme())

// This could also be moved under cypress/support if
// using enzyme in multiple tests
configure({ adapter: new Adapter() })

describe('Unit Test React with Enzyme', function(){
  context('<Greeting />', function(){
    it('displays default greeting', function(){
      const component = shallow(<Greeting />)
      expect(component.find('p')).to.have.text('Hello World')
    })

    it('updates greeting when button is clicked', function(){
      const component = shallow(<Greeting />)
      component.find('button').simulate('click')
      expect(component.find('p')).to.have.text('Bonjour World')
    })
  })
})
