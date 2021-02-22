/// <reference types="Cypress" />
describe('page reloads', () => {
  // ⛔️ THIS WILL NOT WORK
  // NOTE: eventually crashes, cannot use "while" loop with async commands
  it.skip('crashes when using while loop', () => {
    cy.visit('public/index.html')
    .then(() => {
      let found7 = false

      while (!found7) {
        // this schedules an infinite number
        // of "cy.get..." commands, eventually crashing
        // before any of them have a chance to run
        // and set found7 to true
        cy.get('#result').should('not.be.empty')
        .invoke('text').then(parseInt)
        .then((number) => {
          if (number === 7) {
            found7 = true
            cy.log('lucky **7**')
          } else {
            cy.wait(500, { log: false })
            cy.reload()
          }
        })
      }
    })
  })

  // ✅ the right way to schedule more commands
  // after checking the element on the page
  it('until the number 7 appears', () => {
    const checkAndReload = () => {
      // get the element's text, convert into a number
      cy.get('#result').should('not.be.empty')
      .invoke('text').then(parseInt)
      .then((number) => {
        // if the expected number is found
        // stop adding any more commands
        if (number === 7) {
          cy.log('lucky **7**')
        } else {
          // otherwise insert more Cypress commands
          // by calling the function after reload
          cy.wait(500, { log: false })
          cy.reload()
          checkAndReload()
        }
      })
    }

    cy.visit('public/index.html')
    checkAndReload()
  })
})
