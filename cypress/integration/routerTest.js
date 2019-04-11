/// <reference types="Cypress" />

context('Assertions', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    describe("router-test", () => {
        it('.should route to login', () => {
            cy.get('.loginIcon').click().get('h1').should("have.text", "Log in");
        });
    });
});
