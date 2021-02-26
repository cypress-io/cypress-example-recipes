/// <reference types="cypress" />
/* eslint-env browser */
describe('window size', () => {
  /**
   * Collects window and iframe sizes in pixels and prints
   * them to the command log. Also sends the to the plugins file
   * via cy.task to be printed in the terminal
   */
  const logSizes = () => {
    // let's get the total opened browser dimensions
    const windowWidth = window.top.innerWidth
    const windowHeight = window.top.innerHeight

    cy.log(`browser window is: **${windowWidth} x ${windowHeight}**`)
    cy.task('log', { message: 'browser window', o: { windowWidth, windowHeight } }, { log: false })

    // part of the browser window is taken up the command log
    const commandLog = window.top.document.querySelector('.reporter-wrap')
    const commandLogWidth = commandLog.offsetWidth
    const commandLogHeight = commandLog.offsetHeight

    cy.log(`command log is: **${commandLogWidth} x ${commandLogHeight}**`)
    cy.task('log', { message: 'command log', o: { commandLogWidth, commandLogHeight } }, { log: false })

    // the app thinks it has the following dimensions
    cy.window({ log: false }).then((win) => {
      // the application is scaled to fit into its iframe
      // and the iframe's dimensions are
      const iframe = cy.state('$autIframe')
      const iframeWidth = Math.round(iframe.width())
      const iframeHeight = Math.round(iframe.height())

      cy.log(`app iframe real size is: **${iframeWidth} x ${iframeHeight}**`)
      cy.task('log', { message: 'app iframe real size', o: { iframeWidth, iframeHeight } }, { log: false })

      // the application thinks it has the window of the follow size
      // which is the "viewport" numbers
      const viewportWidth = win.innerWidth
      const viewportHeight = win.innerHeight

      cy.log(`app viewport is: **${viewportWidth} x ${viewportHeight}**`)
      cy.task('log', { message: 'app viewport', o: { viewportWidth, viewportHeight } }, { log: false })
    })
  }

  it('shows the page clearly', () => {
    logSizes()
    cy.visit('index.html')
    cy.screenshot('page', { capture: 'runner' })
  })
})
