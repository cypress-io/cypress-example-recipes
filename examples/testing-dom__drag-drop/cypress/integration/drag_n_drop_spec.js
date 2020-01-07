// This recipe shows how to use cy.trigger to test
// drag-n-drop interactions

// There are 2 different games tested:
// one utilizing mouse events and
// one utilizing drag events

describe('Drag n Drop', function () {
  // This tests a puzzle that uses dragula.js, which, under the hood,
  // binds to mousedown, mousemove, and mouseup events
  describe('puzzle using mouse events', function () {
    // A drag and drop action is made up of a mousedown event,
    // multiple mousemove events, and a mouseup event
    // (we can get by with just one mousemove event for our test,
    // even though there would be dozens in a normal interaction)
    //
    // For the mousedown, we specify { which: 1 } because dragula will
    // ignore a mousedown if it's not a left click
    //
    // On mousemove, we need to specify where we're moving
    // with clientX and clientY
    function movePiece (number, x, y) {
      cy.get(`.piece-${number}`)
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { clientX: x, clientY: y })
      .trigger('mouseup', { force: true })
    }

    function completePuzzle (correctly) {
      movePiece(1, 340, correctly ? 130 : 200)
      movePiece(2, 410, 130)
      movePiece(3, 480, 130)
      movePiece(4, 340, correctly ? 200 : 130)
      movePiece(5, 410, 200)
      movePiece(6, 480, 200)
      movePiece(7, 340, 270)
      movePiece(8, 410, 270)
      movePiece(9, 480, 270)
    }

    beforeEach(function () {
      cy.viewport(550, 350)
      cy.visit('/puzzle.html')
    })

    it('moves the piece when dragged to valid place', function () {
      movePiece(1, 340, 130)
      cy.get('.pieces li').eq(3).find('span').should('not.exist')
      cy.get('.places li').eq(0).find('span').should('have.class', 'piece-1')
    })

    it('does not move piece when dragged to invalid place', function () {
      movePiece(1, 0, 0)
      cy.get('.pieces li').eq(3).find('span').should('have.class', 'piece-1')
    })

    it('does not move piece when dragged to occupied place', function () {
      movePiece(1, 340, 130)
      movePiece(2, 340, 130)
      cy.get('.places li').eq(0).find('span').should('have.class', 'piece-1')
      cy.get('.pieces li').eq(7).find('span').should('have.class', 'piece-2')
    })

    it('allows moving piece back to open spot', function () {
      movePiece(1, 340, 130)
      movePiece(1, 70, 180)
      cy.get('.pieces li').eq(3).find('span').should('have.class', 'piece-1')
    })

    it('shows error message when puzzle is completed incorrectly', function () {
      completePuzzle(false)
      cy.get('.notice')
      .should('have.class', 'error')
      .and('have.text', 'Not quite right. Please try again')
    })

    it('shows success message when puzzle is completed correctly', function () {
      completePuzzle(true)
      cy.get('.notice')
      .should('have.class', 'success')
      .and('have.text', 'Success!')
    })
  })

  // This tests a simple game that utilizes the native drag events
  // like dragstart, dragenter, dragleave, and drop
  describe('game using drag events', function () {
    function dropBallInHoop (index) {
      cy.get('.balls img').first()
      .trigger('dragstart')

      cy.get('.hoop')
      .trigger('drop')
    }

    beforeEach(function () {
      cy.clock()
      cy.viewport(400, 350)
      cy.visit('/basketball.html')
    })

    it('shows error message when time runs out', function () {
      cy.tick(10000)
      cy.get('main')
      .should('have.class', 'error')
      .find('p')
      .should('have.text', 'Time\'s up!')
    })

    it('highlights hoop when ball is dragged over it', function () {
      cy.get('.hoop')
      .trigger('dragenter')
      .should('have.class', 'over')
    })

    it('unhighlights hoop when ball is dragged out of it', function () {
      cy.get('.hoop')
      .trigger('dragenter')
      .should('have.class', 'over')
      .trigger('dragleave')
      .should('not.have.class', 'over')
    })

    it('unhighlights hoop when ball is dropped in it', function () {
      cy.get('.hoop')
      .trigger('dragenter')
      .should('have.class', 'over')

      dropBallInHoop()

      cy.get('.hoop')
      .should('not.have.class', 'over')
    })

    it('removes ball when it is dropped in hoop', function () {
      dropBallInHoop()
      cy.get('.balls img').should('have.length', 3)
    })

    it('shows success message when all the balls are dropped in hoop', function () {
      dropBallInHoop()
      dropBallInHoop()
      dropBallInHoop()
      dropBallInHoop()
      cy.get('main')
      .should('have.class', 'success')
      .find('p')
      .should('have.text', 'Success!')
    })
  })
})
