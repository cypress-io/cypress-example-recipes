import { add } from '../support/add'

describe('TypeScript', () => {
  it('works', () => {
    // note TypeScript definition
    const x: number = 42
  })

  it('checks shape of an object', () => {
    const object = {
      name: 'Joe',
      age: 21
    }
    expect(object).to.have.all.keys('name', 'age')
  })

  it('uses cy commands', () => {
    cy.wrap({}).should('deep.eq', {})
  })

  it('adds numbers', () => {
    expect(add(2, 3)).to.equal(5)
  })

  it('yields the subject to .then callback', () => {
    cy.wrap({ foo: 'bar' })
      .then(o => {
        expect(o).to.have.property('foo', 'bar')
      })
  })
})
