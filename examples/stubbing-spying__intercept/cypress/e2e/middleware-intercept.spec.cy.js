describe('intercept', () => {
  beforeEach(() => {
    // Put these in a global `beforeEach` for top-level middleware handlers that
    // affect all requests. Setting `middleware: true` will
    // cause these handlers to always be called first.

    // Set an auth token on all requests:
    cy.intercept('/**', { middleware: true }, (req) => {
      req.headers['authorization'] = 'Bearer AbCdEf123456'
    })

    // Delay API responses to simulate real-world conditions:
    cy.intercept({ url: '/**', middleware: true }, (req) => {
      req.on('response', (res) => {
        res.setDelay(1000)
      })
    })
  })
})
