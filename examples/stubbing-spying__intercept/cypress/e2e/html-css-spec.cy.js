/// <reference types="Cypress" />
describe('HTML', () => {
  it('modifies the page itself', () => {
    const style = `
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      background-color: pink;
      text-align: center;
      text-size: large;
      padding: 1em;
    `

    // we are only interested in the HTML root resource
    cy.intercept({ pathname: '/' }, (req) => {
      req.reply((res) => {
        res.body += `<footer style="${style}">⚠️ This is a Cypress test ⚠️</footer>`
      })
    })

    cy.visit('/')
    cy.contains('footer', 'Cypress test').should('be.visible')
  })
})

describe('CSS', () => {
  it('highlights LI elements using injected CSS', () => {
    // let's intercept the stylesheet the application is loading
    // to highlight list items with a border
    cy.intercept('styles.css', (req) => {
      // to avoid caching responses and the server responding
      // with nothing (because the resource has not changed)
      // and force the server to send the CSS file
      // delete caching headers from the request
      delete req.headers['if-modified-since']
      delete req.headers['if-none-match']

      req.reply((res) => {
        res.send(`${res.body}
          li {
            border: 1px solid pink;
          }
        `)
      })
    })

    cy.visit('/')
    // confirm the CSS was injected and applied
    cy.get('li').should('have.length.gt', 1).first().invoke('css', 'border')
    .should('be.a', 'string')
    .and('include', 'solid')
  })
})
