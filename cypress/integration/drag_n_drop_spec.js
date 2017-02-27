describe('Drag n Drop', function(){

  describe('puzzle using mouse events', function(){

    function movePiece (number, x, y) {
      return cy
        .get(`.piece-${number}`)
        .ttrigger('mousedown', { which: 1 })
        .ttrigger('mousemove', { clientX: x, clientY: y })
        .ttrigger('mouseup')
    }

    function completePuzzle (correctly) {
      return Cypress.Promise.all([
        movePiece(1, 410, correctly ? 130 : 200),
        movePiece(2, 480, 130),
        movePiece(3, 550, 130),
        movePiece(4, 410, correctly ? 200 : 130),
        movePiece(5, 480, 200),
        movePiece(6, 550, 200),
        movePiece(7, 410, 270),
        movePiece(8, 480, 270),
        movePiece(9, 550, 270),
      ])
    }

    beforeEach(function(){
      cy
        .viewport(650, 350)
        .visit('http://localhost:8080/examples/drag_n_drop/puzzle.html')
    })

    it('shows error when puzzle is completed incorrectly', function(){
      completePuzzle(false)
      cy
        .get('.notice')
        .should('have.class', 'error')
        .should('have.text', 'Not quite right. Please try again')
    })

    it('shows error when puzzle is completed correctly', function(){
      completePuzzle(true)
      cy
        .get('.notice')
        .should('have.class', 'success')
        .should('have.text', 'Success!')
    })
  })
})
