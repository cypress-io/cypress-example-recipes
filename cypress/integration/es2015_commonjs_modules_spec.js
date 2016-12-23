// By default we expect you to put global configuration
// in cypress/support/index.js.
//
// But you can also store reusable util functions
// in cypress/support and simply require them
// in your spec files.
//
// Doing so makes it much more obvious where reusable
// functions come from.

// ES2015 import utility foo
import foo from '../support/utils/foo'

// CommonJS require utility bar
const bar = require('../support/utils/bar')

// we can also import node_modules from our package.json
import { upperFirst, lowerFirst } from 'lodash'

// and also require node_modules from our package.json
const minimist = require('minimist')

describe("Modules", function(){

  // you can use ES2015 module import syntax
  context('ES2015', function(){
    it('can import default function', function(){
      expect(foo('bar')).to.eq('foo bar')
    })

    it('can import upperFirst from lodash', function(){
      expect(upperFirst('brian')).to.eq('Brian')
    })

    it('can import lowerFirst from lodash', function(){
      expect(lowerFirst('BRIAN')).to.eq('bRIAN')
    })
  })

  // you can also use node's CommonJS require syntax
  context('CommonJS', function(){
    it('can require module.exports', function(){
      expect(bar('baz')).to.eq('bar baz')
    })

    it('can require minimist', function(){
      // minimist is a command line argument parsing tool
      // that is traditionally used in node (we use it at Cypress)
      //
      // but you can still require it and use it in browser tests too!
      const args = ['--count=1', '--foo', 'bar', '--no-quux']

      expect(minimist(args)).to.deep.eq({
        count: 1,
        foo: 'bar',
        quux: false,
        _: []
      })
    })
  })
})
