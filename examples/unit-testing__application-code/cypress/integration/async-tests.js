/// <reference types="cypress" />

import {reverseString} from '../../async-methods'

describe('Async reverse', () => {
  it('reverses a string', () => {
    // important: you need to return the promise from the test
    // to let the test runner know when the test has finished
    // otherwise the test will finish, but then the assertion will suddenly
    // run - and even if the assertion fails, the test has completed already
    return reverseString('foo').then(result => {
      expect(result).to.equal('oof')
    })
  })

  it('reverses a string with await', async () => {
    // alternatively you can use "async / await" in these unit tests
    // to deal with promises
    const result = await reverseString('bar')
    expect(result).to.equal('rab')
  })
})
