/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unused-vars */
// We need to use a namespace to merge our custom commands types into cypress
declare namespace Cypress {
  interface Chainable {
    /**
     * Custom command to authenticate a user.
     * @example cy.auth(user.id)
     */
    auth(userId: string): Chainable<void>;
  }
}
