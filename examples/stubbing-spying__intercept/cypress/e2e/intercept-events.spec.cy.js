describe('intercept', () => {
  beforeEach(() => {
    cy.intercept('/fruits', (req) => {
      req.on('before:response', (res) => {
        /**
         * Emitted before `response` and before any `req.continue`
         * handlers. Modifications to `res` will be applied to the
         * incoming response.
         */
        if (req.headers['x-destroy-response']) {
          req.destroy()
        }

        if (req.headers['x-fail-response']) {
          res.send({ fixture: 'failure.json' })
        }
      })

      req.on('response', (res) => {
        /**
         * Emitted after `before:response` and after any
         * `req.continue` handlers - before the response is sent
         * to the browser. Modifications to `res` will be applied
         * to the incoming response.
         */
        if (req.headers['x-mobile-user']) {
          res.throttleKbps(3000)
        }
      })

      req.on('after:response', (res) => {
        /**
         * Emitted once the response to a request has finished
         * sending to the browser. Modifications to `res` have no
         * impact.
         */
        if (req.headers['x-redirect-user']) {
          expect(res.statusCode).to.equal(302)
        }
      })
    })
  })
})
