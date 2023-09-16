/* eslint-disable no-console */
/* eslint-disable @cypress/dev/skip-comment */
describe('Testing index website', () => {
  it.skip('Fail on the cypress test ', () => {
    cy.visit('index.html');
    cy.get('button#error').click();

    cy.wait(1500);
  });

  it('Can be ignore', () => {
    cy.on('uncaught:exception', (e, runnable) => {
      console.log(e, runnable);

      if (e.message.includes('Things went bad')) {
        // we expected this error, so let's ignore it
        // and let the test continue
        return false;
      }
    });

    cy.visit('index.html');
    cy.get('button#error').click();

    cy.wait(1500);
  });

  it('Wait for the error', () => {
    const error = {
      message: null
    };

    cy.on('uncaught:exception', (e, runnable) => {
      error.message = e.message;

      return false;
    });

    cy.visit('index.html');
    cy.get('button#error').click();

    // eslint-disable-next-line arrow-parens
    cy.wrap(error).should(c => {
      expect(c.message).to.include('Things went bad');
    });
  });
});
