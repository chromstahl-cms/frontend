/// <reference types="Cypress" />

context('Assertions', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    describe("test", () => {
        it('.should do things', () => {
            cy.get('.loginIcon').click().get('.form-heading').should("have.text", "Log in")
        });
    });
});
