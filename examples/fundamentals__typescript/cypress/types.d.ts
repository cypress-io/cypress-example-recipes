/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject=any> {
    clickLink(label: string | number | RegExp): void
  }

  interface ApplicationWindow {
    add(a: number, b: number): number
  }
}
