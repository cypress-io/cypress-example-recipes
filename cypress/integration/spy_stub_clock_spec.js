// This recipe utilizes Cypress methods that help you
// control function behavior and time

// This app we are testing shows a random list of
// "favorite fruits" that refreshes every 30 seconds

describe('Spy / Stub / Clock', function(){
  // Here, we let calls go through to the server
  // but verify that the right call is made by spying on
  // window.fetch
  describe('spying', function () {
    beforeEach(function () {
      // We use cy.visit({onBeforeLoad: ...}) to spy on
      // window.fetch before any app code runs
      cy.visit('http://localhost:8087', {
        onBeforeLoad (win) {
          cy.spy(win, 'fetch')
        }
      })
    })

    it('requests favorite fruits', function () {
      cy.window().its('fetch').should('be.calledWith', '/favorite-fruits')
    })

    it('displays favorite fruits', function () {
      cy.get('.favorite-fruits li').should('have.length', 5)
    })
  })

  // Here, we completely stub out window.fetch, allowing
  // us to more finely control the server responses
  //
  // This allows us to test various data responses like errors
  describe('stubbing', function () {
    beforeEach(function () {
      // We use a deferred object to make it easy to test
      // different scenarios
      this.fetchFavoritesDeferred = deferred()

      // We use cy.visit({onBeforeLoad: ...}) to stub
      // window.fetch before any app code runs
      cy.visit('http://localhost:8087', {
        onBeforeLoad (win) {
          cy
            .stub(win, 'fetch')
            .withArgs('/favorite-fruits')
            .as('fetchFavorites')
            .returns(this.fetchFavoritesDeferred.promise)
        }
      })
    })

    it('requests favorite fruits', function () {
      // aliasing allows us to easily get access to our stub
      cy.get('@fetchFavorites').should('be.calledWith', '/favorite-fruits')
    })

    // A big advantage of controlling the response is we can test
    // how our app handles a slow response, which normally might be
    // difficult against a fast development server
    it('shows loader while fetching fruits', function () {
      cy.get('.loader')
    })

    describe('when favorite fruits are returned', function () {
      beforeEach(function () {
        this.fetchFavoritesDeferred.resolve({
          json () { return ['Apple', 'Banana', 'Cantaloupe'] },
          ok: true,
        })
      })

      it('displays them', function () {
        cy.get('.favorite-fruits li').as('favoriteFruits').should('have.length', 3)
        cy.get('@favoriteFruits').first().should('have.text', 'Apple')
        cy.get('@favoriteFruits').eq(1).should('have.text', 'Banana')
        cy.get('@favoriteFruits').eq(2).should('have.text', 'Cantaloupe')
      })
    })

    describe('when no favorite fruits are returned', function () {
      beforeEach(function () {
        this.fetchFavoritesDeferred.resolve({
          json () { return [] },
          ok: true,
        })
      })

      it('displays empty message', function () {
        cy.get('.favorite-fruits').should('have.text', 'No favorites')
      })
    })

    describe('when request fails', function () {
      beforeEach(function () {
        this.fetchFavoritesDeferred.resolve({
          ok: false,
          statusText: 'Orchard under maintenance',
        })
      })

      it('displays error', function () {
        cy
          .get('.favorite-fruits')
            .should('have.text', 'Failed loading favorite fruits: Orchard under maintenance')
      })
    })
  })

  // The favorite fruits are refreshed every 30 seconds
  // It would slow down our tests dramatically to literally
  // wait that long to verify the behavior.
  //
  // We can use Cypress's clock and tick commands to speed it up.
  //
  // Since the list of fruits returned from the API are random,
  // using the real server would lead to flaky tests, so we
  // stub out window.fetch again in order to control the response
  describe('clock', function () {
    beforeEach(function () {
      this.fetchFavoritesDeferred = deferred()

      cy
        .clock()
        .visit('http://localhost:8087', {
          onBeforeLoad (win) {
            cy
              .stub(win, 'fetch')
              .withArgs('/favorite-fruits')
              .as('fetchFavorites')
              .returns(this.fetchFavoritesDeferred.promise)
          }
        })
    })

    describe('when favorite fruits are returned', function () {
      beforeEach(function () {
        this.fetchFavoritesDeferred.resolve({
          json () { return ['Apple', 'Banana', 'Cantaloupe'] },
          ok: true,
        })
      })

      it('displays list of fruits', function () {
        cy
          .get('.favorite-fruits li').as('favoriteFruits')
            .should('have.length', 3)

          .get('@favoriteFruits').first()
            .should('have.text', 'Apple')
          .get('@favoriteFruits').eq(1)
            .should('have.text', 'Banana')
          .get('@favoriteFruits').eq(2)
            .should('have.text', 'Cantaloupe')
      })

      describe('polling every 30 secs', function () {
        beforeEach(function () {
          // since we aliased the window.fetch stub to 'fetchFavorites',
          // it becomes available as this.fetchFavorites in our tests
          this.fetchFavorites.onCall(1).resolves({
            json () { return ['Orange', 'Cherry', 'Raspberry', 'Pineapple'] },
            ok: true,
          })
          // move time 30 seconds and the setInterval will be triggered
          // that polls for the fruit
          cy.tick(30000)
        })

        it('fetches fruit again', function () {
          expect(this.fetchFavorites).to.be.calledTwice
        })

        it('displays the new list of fruits', function () {
          cy
            .get('.favorite-fruits li').as('favoriteFruits')
              .should('have.length', 4)

            .get('@favoriteFruits').first()
              .should('have.text', 'Orange')
            .get('@favoriteFruits').eq(1)
              .should('have.text', 'Cherry')
            .get('@favoriteFruits').eq(2)
              .should('have.text', 'Raspberry')
            .get('@favoriteFruits').eq(3)
              .should('have.text', 'Pineapple')
        })
      })
    })
  })

  function deferred () {
    const deferred = {}
    deferred.promise = new Promise((resolve, reject) => {
      deferred.resolve = resolve
      deferred.reject = reject
    })
    return deferred
  }
})
