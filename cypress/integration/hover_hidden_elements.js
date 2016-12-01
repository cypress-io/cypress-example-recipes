// This recipe shows you how to get around the lack of a cy.hover()
// command.
//
// We'll investigate strategies for dealing with hidden elements.
//
// Additionally we'll talk show you how to fire mouse events
// on an element so that javascript event callbacks are invoked.
//
describe('Hover and Hidden Elements', function(){
  beforeEach(function(){
    // all we need is a small viewport
    cy.viewport(500, 400)
  })

  // hidden.html
  context('hidden elements', function(){
    beforeEach(function(){
      cy
        // This html page includes an element which is hidden until
        // the :hover CSS psuedo selector is triggered by a real mouse hover
        //
        // Additionally when the <button> is clicked we populate text in a <p>
        // to highlight a typical scenario where you are interacting with a hidden
        // element that generates side effects.
        .visit('http://localhost:8080/examples/hover_hidden_elements/hidden.html')
    })

    it('strategy #1: force events to happen', function(){
      // By default before Cypress interacts with an element it will check
      // to ensure its not hidden (amongst other things)
      //
      // Sometimes the simplest work-around in this scenario is to just force
      // the event to happen anyway
      cy
        .get('button').click({force: true})
        .get('#message').should('contain', 'the button was clicked')
    })

    it('strategy #2: force the element to be visible before click', function(){
      // We get a lot of value out of letting Cypress ensure the element is interactable
      // and its nice to not have to 'force' events to happen.
      //
      // Because we have total and unrestricted access to everything in Cypress
      // we can simply modify 'the state of the world' to best suit our testing
      // needs.
      //
      // In this example we will simply force the element to be shown before clicking it.
      cy
        // Cypress automatically wraps all elements with our own jQuery
        // so we can simply call the jQuery method: 'show' on the element
        // which forces it to have a 'display: block' CSS style inlined on it
        .get('button').invoke('show').click()
        .get('#message').should('contain', 'the button was clicked')
    })

    it('strategy #3: verify visibility prior to showing element', function(){
      // We can improve on strategy #2 above by adding some tests around the elements
      // visibility.
      //
      // This first guarantees the element is in the correct visible state before we
      // manually modify it.
      cy
        .get('button').should('be.hidden').invoke('show').click()
        .get('#message').should('contain', 'the button was clicked')
    })
  })

  // mouse.html
  context('mouse events', function(){
    beforeEach(function(){
      cy
        // This html page includes a button which is bound to several
        // mouse events. This shows you how you would cause those events
        // to be fired.
        //
        .visit('http://localhost:8080/examples/hover_hidden_elements/mouse.html')
    })

    describe('if your app uses jquery', function(){
      ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
        it(`triggers event: '${event}`, function(){
          // if your app uses jquery then we can simply trigger a jquery
          // event which will cause the event callback to fire
          cy
            .get('#with-jquery').invoke('trigger', event)
            .get('#messages').should('contain', `the event ${event} was fired`)
            .debug()
        })
      })
    })

    describe('if your app does not use jquery', function(){
      ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
        it(`dispatches event: '${event}`, function(){
          // if your app doesnt use jquery then we need to manually
          // build up and dispatch this event
          cy
            .get('#no-jquery').then(function($btn){
              const obj = {}

              // TODO: we are obviously not happy about this
              // and don't want you to have to build up events
              // manually like this.
              //
              // We are soon releasing a `cy.trigger` command which
              // under the hood will build up and dispatch events
              // but also do some niceties like automatically knowing
              // whether events bubble, whether they're cancellable,
              // and filling in properties like clientX and clientY
              // so events are dispatched akin to other cypress commands
              switch(event){
                case 'mouseover':
                case 'mouseout':
                  obj.bubbles = true
                  obj.cancelable = true
                  break;
                case 'mouseenter':
                case 'mouseleave':
                  obj.bubbles = false
                  obj.cancelable = false
                  break;
              }

              // generate the manual event instance
              const e = new Event(event, obj)

              // dispatch this on our btn
              $btn.get(0).dispatchEvent(e)
            })
            .get('#messages').should('contain', `the event ${event} was fired`)
        })
      })
    })
  })
})