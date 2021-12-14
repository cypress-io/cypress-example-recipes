// This recipe shows how to interact with a range input (slider)

// Eventually, this will be expanded to includes examples of interacting
// with various form elements

describe('Form Interactions', function () {
  beforeEach(function () {
    cy.viewport(400, 300)
    cy.visit('/index.html')
  })

  it('updates range value when moving slider', function () {
    // To interact with a range input (slider), we need to set its value and
    // then trigger the appropriate event to signal it has changed

    // Here, we invoke jQuery's val() method to set the value
    // and trigger the 'change' event

    // Note that some implementations may rely on the 'input' event,
    // which is fired as a user moves the slider, but is not supported
    // by some browsers
    cy.get('input[type=range]').as('range')
    .invoke('val', 25)
    .trigger('change')

    cy.get('@range').siblings('p')
    .should('have.text', '25')
  })
})
