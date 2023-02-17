// @flow
import { add } from '../support/add' // Flow typed file

declare function describe(any, Function): any
declare function it(any, Function): any
declare function expect(any): any

describe('Flow', () => {
  it('works', () => {
    // note: Flow definition
    const x: number = 42

    add(1, 'a') // Flow error
  })
})
