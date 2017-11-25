declare const expect: Chai.ExpectStatic;

describe('TypeScript', () => {
  it('works', () => {
    // note TypeScript definition
    const x:number = 42
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
})
