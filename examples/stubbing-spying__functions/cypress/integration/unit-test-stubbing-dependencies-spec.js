// cy.stub makes it easy to stub methods on dependencies
// and test a unit of code in isolation

// See docs for cy.stub here: https://on.cypress.io/stub

// auth.js is the code under test
// (our app code that deals with authentication)
import Auth from '../../auth'

// api.js is an adapter for the API the app uses
import api from '../../api'

// util.js is a module with utility functions
import util from '../../util'

describe('Stubbing Dependencies', function () {
  beforeEach(function () {
    cy.stub(api, 'onUnauth')
    this.auth = new Auth()
  })

  describe('on init', function () {
    it('starts out logged out', function () {
      expect(this.auth.loggedIn).to.be.false
    })

    it('starts out with no user id', function () {
      expect(this.auth.userId).to.be.null
    })

    it('subscribes to api.onUnauth', function () {
      expect(api.onUnauth).to.be.called
      expect(api.onUnauth.firstCall.args[0]).to.be.a('function')
    })
  })

  describe('when login succeeds', function () {
    // api.login returns a promise. instead of constructing a promise
    // and setting our stub to return it, we can use stub.resolves()
    // to return a resolved promise
    beforeEach(function () {
      cy.stub(api, 'login').resolves('user-id-123')

      return this.auth.login('user', 'pass')
    })

    it('updates logged in status to true', function () {
      expect(this.auth.loggedIn).to.be.true
    })

    it('updates user id', function () {
      expect(this.auth.userId).to.equal('user-id-123')
    })
  })

  describe('when login fails', function () {
    // like above, we can use stub.rejects() to return a rejected
    // promise from api.login
    beforeEach(function () {
      cy.stub(api, 'login').rejects(new Error('Wrong password'))
      cy.stub(util, 'log')

      return this.auth.login('user', 'pass')
    })

    it('remains logged out', function () {
      expect(this.auth.loggedIn).to.be.false
    })

    it('logs error', function () {
      expect(util.log).to.be.calledWith('Wrong password')
    })
  })

  describe('when api notifies user has been unauthenticated', function () {
    // when a stubbed function takes a callback, stub.yield() is an
    // easy way to call that callback
    beforeEach(function () {
      cy.stub(api, 'login').resolves('user-id-123')

      return this.auth.login('user', 'pass').then(() => {
        api.onUnauth.yield()
      })
    })

    it('updates logged in status to false', function () {
      expect(this.auth.loggedIn).to.be.false
    })
  })
})
