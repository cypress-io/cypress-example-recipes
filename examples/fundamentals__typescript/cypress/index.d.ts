declare namespace Cypress {
  interface Chainable<Subject=any> {
    clickLink(label: string | number | RegExp): void
  }
}
