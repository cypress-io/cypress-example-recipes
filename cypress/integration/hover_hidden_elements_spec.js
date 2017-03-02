// This recipe shows you how to get around the lack
// of a cy.hover() command.
//
// We'll also investigate strategies for dealing with hidden elements.
//
// Additionally we'll show you how to fire mouse events
// on an element so that JavaScript event callbacks are invoked.

describe('Hover and Hidden Elements', function(){
  context('hidden elements', function(){
    beforeEach(function(){
      // In `examples/hover_hidden_elements/hidden.html`,
      // the html page includes an element that is hidden until
      // the :hover CSS psuedo selector is triggered by a mouse hover
      //
      // Additionally when the <button> is clicked
      // our application populates text in a <p>

      cy.visit('http://localhost:8080/examples/hover_hidden_elements/hidden.html')
    })

    it('solution #1: force events to happen', function(){
      // By default, before Cypress interacts with an element,
      // it checks to ensure the element is not hidden
      //
      // Some commands, like cy.click, allow you to pass 'force: true'
      // as an option to bypass these checks and allow the event to happen anyway
      cy
        .get('button').click({force: true})
        .get('#message').should('contain', 'the button was clicked')
    })

    it('solution #2: force the element to be visible before click', function(){
      // We get a lot of value out of letting Cypress ensure the element
      // is interactable and its nice to not 'force' events to happen.
      //
      // Instead, we can modify 'the state of the world' to
      // best suit our testing needs.
      //
      // In this example we will force the element to be shown before clicking it.
      cy
        // Cypress automatically wraps all elements with our own jQuery
        // so we can call the jQuery method: 'show' on the element.
        // This forces it to have a 'display: block' CSS style inlined on it
        .get('button').invoke('show').click()
        .get('#message').should('contain', 'the button was clicked')
    })

    it('solution #3: verify visibility prior to showing element', function(){
      // We can improve on solution #2 above by adding some tests
      // around the elements visibility.
      //
      // We check that the element is in the correct
      // visible state before manually modifying it.
      cy
        .get('button').should('be.hidden').invoke('show').click()
        .get('#message').should('contain', 'the button was clicked')
    })
  })

  context('mouse events', function(){
    beforeEach(function(){
      // In `examples/hover_hidden_elements/mouse.html`,
      // the html page includes a button that is bound to several
      // mouse events. This shows you how to cause those events to fire.

      cy.visit('http://localhost:8080/examples/hover_hidden_elements/mouse.html')
    })

    describe('if your app uses jQuery', function(){
      ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
        it(`triggers event: '${event}`, function(){
          // if your app uses jQuery, then we can trigger a jQuery
          // event that causes the event callback to fire
          cy
            .get('#with-jquery').invoke('trigger', event)
            .get('#messages').should('contain', `the event ${event} was fired`)
        })
      })
    })

    describe('if your app does not use jQuery', function(){
      ['mouseover', 'mouseout', 'mouseenter', 'mouseleave'].forEach((event) => {
        it(`dispatches event: '${event}`, function(){
          // if your app doesnt use jQuery then we need to manually
          // build up and dispatch this event
          cy
            .get('#no-jquery').then(function($btn){
              const obj = {}

              // We are soon releasing a `cy.trigger` command that
              // under the hood will build up and dispatch events
              // so you don't have to write this.
              // It will also automatically know whether events bubble,
              // whether they're cancellable and fill in
              // properties like clientX and clientY so events
              // are dispatched like in other cypress commands

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
