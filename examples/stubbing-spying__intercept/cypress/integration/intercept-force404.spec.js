/// <reference types="Cypress" />

describe("intercept", () => {
  beforeEach(() => {
    // this solution assumes:
    // - you're only dealing with XHR requests
    // - your app sets the `accept` header to "application/json"

    // stop all other Ajax application/json requests
    // by responding with `404`
    cy.intercept(
      {
        headers: {
          accept: "application/json",
        },
      },
      {
        statusCode: 404,
      }
    );

    // DO NOT DO THIS:
    // cy.intercept('*', { statusCode: 404 })
    // as it will break all network requests
  });
  it("test", () => {
    cy.visit("/");
  });
});
