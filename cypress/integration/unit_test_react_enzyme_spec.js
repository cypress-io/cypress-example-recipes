import React from 'react'
import chaiEnzyme from 'chai-enzyme'
import { shallow } from 'enzyme'

import Greeting from '../../examples/unit_test_react_enzyme/greeting'

// Cypress automatically exposes the 'chai'
// global to all spec files. This enables us
// to extend chai with enzyme specific assertions
// for this one spec file.
//
// Alternatively we could move this configuration
// into cypress/support/assertions to enable all
// spec files to use these chai-enzyme assertions

chai.use(chaiEnzyme)

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
