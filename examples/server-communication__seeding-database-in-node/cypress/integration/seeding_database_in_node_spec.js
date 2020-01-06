// This recipe shows you how to seed your database using node.js

describe('Seeding Database in Node', function () {
  beforeEach(function () {
    cy.fixture('seed').as('seed')
  })

  it('can use fixture data to seed database', function () {
    // We can use cy.task to communicate with node via the pluginsFile
    // See cypress/plugins/main.js for the implementation of the 'seed:db' task
    cy.task('seed:db', this.seed)
    cy.visit('/index.html')
    cy.get('#posts li').should('have.length', 3)
    cy.get('#posts li').first().find('h2').should('have.text', 'Cypress is going open source!')
  })

  it('can directly seed data to test empty state', function () {
    cy.task('seed:db', { posts: [] })
    cy.visit('/index.html')
    cy.get('#posts').should('have.text', 'No posts')
  })
})
