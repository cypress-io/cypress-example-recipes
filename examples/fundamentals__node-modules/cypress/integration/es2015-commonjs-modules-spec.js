// By default we expect you to put global configuration
// in cypress/support/index.js.
//
// But you can also store reusable util functions
// in cypress/support and simply require them
// in your spec files.
//
// Doing so makes it much more obvious where reusable
// functions come from.

// ES2015 import utility get_selector
import getSelector from '../support/utils/get_selector'

// CommonJS require utility append_key
const appendKey = require('../support/utils/append_key')

// we can also import node_modules from our package.json
import { upperFirst, lowerFirst } from 'lodash'

// and also require node_modules from our package.json
const minimist = require('minimist')

describe('Modules', function () {
  // you can use ES2015 module import syntax
  context('ES2015', function () {
    it('can import default function', function () {
      expect(getSelector('checkbox')).to.eq('.my-app-checkbox')
    })

    it('can import upperFirst from lodash', function () {
      expect(upperFirst('jane')).to.eq('Jane')
    })

    it('can import lowerFirst from lodash', function () {
      expect(lowerFirst('JANE')).to.eq('jANE')
    })
  })

  // you can also use node's CommonJS require syntax
  context('CommonJS', function () {
    it('can require module.exports', function () {
      expect(appendKey('jane.lane@devs.com')).to.eq('jane.lane@devs.com+APIkey123')
    })

    it('can require minimist', function () {
      // minimist is a command line argument parsing tool
      // that is traditionally used in node (we use it at Cypress)
      //
      // but you can still require it and use it in browser tests too!
      const args = ['--count=1', '--foo', 'bar', '--no-quux']

      expect(minimist(args)).to.deep.eq({
        count: 1,
        foo: 'bar',
        quux: false,
        _: [],
      })
    })
  })
})
